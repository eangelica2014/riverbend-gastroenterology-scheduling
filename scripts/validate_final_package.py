from __future__ import annotations

import json
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DECK = ROOT / "artifacts" / "presentation" / "final-hiring-manager-deck"


def require(path: Path) -> None:
    if not path.exists():
        raise AssertionError(f"Missing required artifact: {path.relative_to(ROOT)}")


def main() -> None:
    required = [
        ROOT / "artifacts" / "Hiring_Manager_Checklist_Manifesto.md",
        ROOT / "artifacts" / "Hiring_Manager_Roadmap_and_User_Guide.md",
        ROOT / "artifacts" / "Riverbend_Gastroenterology_Scheduling_PRD_Eangelica_Aton.docx",
        ROOT / "artifacts" / "presentation" / "final_video_script.md",
        ROOT / "docs" / "hiring-manager-requirement-audit.md",
        ROOT / "docs" / "compliance-evidence-matrix.md",
        ROOT / "agent" / "scenarios.json",
        DECK / "slide_state.json",
        DECK / "slide_notes.json",
        DECK / "slide_notes.md",
    ]
    for path in required:
        require(path)

    scenarios = json.loads((ROOT / "agent" / "scenarios.json").read_text())
    assert len(scenarios["scenarios"]) == 25, "Scenario source must contain 25 cases"
    assert any(item["id"] == "SCN-FAQ-LOCATIONS" for item in scenarios["scenarios"]), "Location FAQ regression is missing"

    state = json.loads((DECK / "slide_state.json").read_text())
    slides = state["slides"]
    assert state["project_info"]["total_slides"] == 19, "Final deck must contain 19 slides"
    assert len(slides) == 19, "Slide state must enumerate 19 slides"
    assert all(item["state"] == "edited" for item in slides), "Every slide must be edited"
    assert [item["pageNum"] for item in slides] == list(range(1, 20)), "Slide numbering must be sequential"

    slide_ids = {item["id"] for item in slides}
    referenced_slide_ids: set[str] = set()
    element_ids_by_slide: dict[str, set[str]] = {}
    external_links = 0

    for slide in slides:
        xml_path = DECK / f"{slide['id']}.xml"
        require(xml_path)
        root = ET.parse(xml_path).getroot()
        assert root.tag == "slide", f"{xml_path.name} must contain one slide root"
        element_ids: list[str] = []
        for element in root.iter():
            if element is root:
                continue
            if "id" in element.attrib:
                element_ids.append(element.attrib["id"])
            if element.tag == "a":
                if element.attrib.get("slide"):
                    referenced_slide_ids.add(element.attrib["slide"])
                if element.attrib.get("href"):
                    external_links += 1
        assert len(element_ids) == len(set(element_ids)), f"Duplicate element id in {xml_path.name}"
        element_ids_by_slide[slide["id"]] = set(element_ids)

    missing_targets = referenced_slide_ids - slide_ids
    assert not missing_targets, f"Unknown internal slide links: {sorted(missing_targets)}"

    notes = json.loads((DECK / "slide_notes.json").read_text())
    assert len(notes) == 19, "Speaker notes must cover all 19 slides"

    print("Final package validation passed")
    print(f"- slides: {len(slides)} edited, sequential, internally linked")
    print(f"- internal link targets: {len(referenced_slide_ids)} valid")
    print(f"- external links: {external_links}")
    print(f"- speaker notes: {len(notes)}")
    print(f"- scenarios: {len(scenarios['scenarios'])}, including SCN-FAQ-LOCATIONS")


if __name__ == "__main__":
    main()
