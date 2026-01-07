"use client";

import * as React from "react";
import { Icon } from "judix-icon";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Option } from "../ui/option";
import { TextInput } from "../ui/text-input";


export interface Project {
    id: string;
    name: string;
    description: string;
}

export interface BookmarkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projects: Project[];
    recentProjects: Project[];
    onSave: (projects: Project[]) => void;
    onCreateNewProject: () => void;
    className?: string;
}

export interface ProjectListProps {
    projects: Project[];
    selectedProjects: Project[];
    onSelect: (project: Project) => void;
}

export function ProjectList({ projects, selectedProjects, onSelect }: ProjectListProps) {
    return (
        <div
            className="absolute top-full left-0 right-0 mt-1 bg-color-surface-neutral-default border border-color-border-neutral-default rounded-lg shadow-lg max-h-[300px] overflow-y-auto z-50 p-2 flex flex-col gap-1"
        >
            {projects.length > 0 ? (
                projects.map((project) => (
                    <Option
                        key={project.id}
                        title={project.name}
                        subtext={project.description}
                        selected={!!selectedProjects.find(p => p.id === project.id)}
                        onClick={() => onSelect(project)}
                        prefixSlot={
                            <Icon
                                name="DocumentText1"
                                className="h-4 w-4"
                            />
                        }
                    />
                ))
            ) : (
                <div className="p-3 text-sm text-color-text-neutral-tertiary text-center">
                    No projects found
                </div>
            )}
        </div>
    );
}

function BookmarkDialog({
    open,
    onOpenChange,
    projects,
    recentProjects,
    onSave,
    onCreateNewProject,
    className
}: BookmarkDialogProps) {
    const [search, setSearch] = React.useState("");
    const [selectedProjects, setSelectedProjects] = React.useState<Project[]>(
        []
    );
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredProjects = React.useMemo(() => {
        return projects.filter(
            (p) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase())
        );
    }, [projects, search]);

    const handleSelectProject = (project: Project) => {
        if (!selectedProjects.find(p => p.id === project.id)) {
            setSelectedProjects(prev => [...prev, project]);
        }
        setSearch("");
    };

    const handleRemoveProject = (projectId: string) => {
        setSelectedProjects(prev => prev.filter(p => p.id !== projectId));
        inputRef.current?.focus();
    };

    const handleSave = () => {
        if (selectedProjects.length > 0) {
            onSave(selectedProjects);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn("sm:max-w-[480px] p-6 rounded-2xl gap-6 bg-color-surface-neutral-default", className)}
                showCloseButton={true}
            >
                <DialogHeader className="flex-row items-center gap-2">
                    <Icon
                        name="DocumentText1"
                        className="h-5 w-5 text-icon_button-color-primary-icon"
                    />
                    <DialogTitle>Bookmark</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-2">
                    <div className="relative" ref={dropdownRef}>
                        <TextInput
                            ref={inputRef}
                            label=""
                            placeholder={
                                selectedProjects.length > 0 ? "" : "Choose existing project"
                            }
                            value={search}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setSearch(e.target.value);
                                setIsDropdownOpen(true);
                            }}
                            onFocus={() => setIsDropdownOpen(true)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (
                                    e.key === "Backspace" &&
                                    search === "" &&
                                    selectedProjects.length > 0
                                ) {
                                    setSelectedProjects((prev) => prev.slice(0, -1));
                                }
                            }}
                            selectedLabels={selectedProjects.map((project) => ({
                                text: project.name,
                                onRemove: () => handleRemoveProject(project.id)
                            }))}
                            showLabelsInline={true}
                            className="bg-color-textinput-bg"
                        />

                        {isDropdownOpen && (
                            <ProjectList
                                projects={filteredProjects}
                                selectedProjects={selectedProjects}
                                onSelect={handleSelectProject}
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-color-text-neutral-secondary">
                            Recent projects
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {recentProjects.map((project) => (
                                <Label
                                    key={project.id}
                                    colorScheme="neutral"
                                    size="medium"
                                    onClick={() => handleSelectProject(project)}
                                    className="cursor-pointer hover:bg-color-surface-neutral-hover_default"
                                >
                                    {project.name}
                                </Label>
                            ))}
                        </div>
                    </div>


                </div>


                <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between sm:space-x-0 gap-3 sm:gap-0">
                    <Button
                        variant="neutral"
                        size="medium"
                        onClick={onCreateNewProject}
                        className="p-2 rounded-lg text-sm"
                    >
                        Create new project
                    </Button>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button
                            variant="neutral"
                            size="medium"
                            onClick={() => onOpenChange(false)}
                            className="h-auto text-sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="medium"
                            onClick={handleSave}
                            disabled={selectedProjects.length === 0}
                            className="h-auto text-sm"
                        >
                            Save
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

BookmarkDialog.displayName = "BookmarkDialog";

export { BookmarkDialog };
