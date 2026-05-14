'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@judix/icon';
import { Option } from '../ui/option';
import { TextInput } from '../ui/text-input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export interface ProjectChoiceItem {
    id: string;
    name: string;
    description?: string;
}

export interface ProjectChoiceDropdownProps {
    /* List of projects to display */
    projects: ProjectChoiceItem[];
    /* Currently selected project id */
    selectedProjectId?: string | null;
    /* Called when a project is selected */
    onSelect?: (project: ProjectChoiceItem) => void;
    /* Search placeholder */
    placeholder?: string;
    /* Label for the action button (default: "New project") */
    newProjectLabel?: string;
    /* Called when the "New project" button is clicked */
    onNewProject?: () => void;
    className?: string;
}

export function ProjectChoiceDropdown({
    projects,
    selectedProjectId = null,
    onSelect,
    placeholder = 'Search in here',
    newProjectLabel = 'New project',
    onNewProject,
    className,
}: ProjectChoiceDropdownProps) {

    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState("");
    const optionsContainerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const containerClasses = cn(
        "bg-dropdown-color-bg rounded-dropdown-border-radius-default border border-dropdown-color-stroke dropdown-border-weight-default",
        className
    );

    return (
        <div className={cn("w-90", containerClasses)}>
            <div className="flex items-center justify-between gap-2 border-b border-textinput-color-stroke-default p-2">
                <TextInput
                    inputSize="medium"
                    label=""
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="default"
                    className="flex-1 w-full border-none bg-transparent shadow-none focus-visible:ring-0"
                    ref={searchInputRef}
                    autoFocus={true}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            if (filteredProjects.length > 0) {
                                onSelect?.(filteredProjects[0]);
                                setSearchTerm("");
                            }
                        }
                    }}
                />

                <Button
                    variant="neutral"
                    size="extraSmall"
                    prefixIcon="add"
                    onClick={() => {
                        router.push("/projects?new=true");
                        onNewProject?.();
                    }}
                    className="shrink-0"
                >
                    {newProjectLabel}
                </Button>
            </div>

            <div className="p-2">
                <div
                    ref={optionsContainerRef}
                    className="space-y-1 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => (
                            <Option
                                key={project.id}
                                title={project.name}
                                subtext={project.description}
                                prefixSlot={
                                    <Icon
                                        name="document-text-a"
                                        className="w-[18px] h-[18px] shrink-0 text-color-icon-neutral-default"
                                    />
                                }
                                selected={selectedProjectId === project.id}
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    onSelect?.(project);
                                    setSearchTerm("");
                                }}
                            />
                        ))
                    ) : (
                        <div className="p-2 option-font-title text-center textinput-color-text-active">
                            No results found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
