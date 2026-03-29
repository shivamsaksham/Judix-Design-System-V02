import * as React from "react";
import { Icon } from "@judix/icon";
import { Dropdown } from "../ui/dropdown";

export interface Project {
    id: string;
    name: string;
    description: string;
}

export interface ProjectListProps {
    projects: Project[];
    selectedProjects: Project[];
    onSelect: (project: Project) => void;
}

export function ProjectList({ projects, selectedProjects, onSelect }: ProjectListProps) {
    return (
        <Dropdown
            className="absolute top-full left-0 right-0 mt-1 z-50 w-full"
            options={projects.map((project) => ({
                value: project.id,
                title: project.name,
                subtext: project.description,
                leadingIcon: <Icon name="document-text-a" className="h-4 w-4" />
            }))}
            value={selectedProjects.length > 0 ? selectedProjects[0].id : null}
            onChange={(value) => {
                const project = projects.find((p) => p.id === value);
                if (project) {
                    onSelect(project);
                }
            }}
            searchbar="off"
        />
    );
}
