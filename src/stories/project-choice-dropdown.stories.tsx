import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
    ProjectChoiceDropdown,
    type ProjectChoiceDropdownProps,
} from '@/components/block/project-choice-dropdown';
import { useState } from 'react';

const sampleProjects: ProjectChoiceDropdownProps['projects'] = [
    {
        id: 'patna',
        name: 'Patna land case',
        description: 'Land acquisition case filed in Patna HC. Respondent side.',
    },
    {
        id: 'gst',
        name: 'GST tax notice case',
        description: 'GST notice tax refund case. Issue in filing of GSTR 3B',
    },
    {
        id: 'lucknow',
        name: 'Non bailable offence lucknow',
        description:
            'A murder case in Lucknow. Petitioner side. A case of forced road accident.',
    },
];

const meta: Meta<typeof ProjectChoiceDropdown> = {
    title: 'Block/ProjectChoiceDropdown',
    component: ProjectChoiceDropdown,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    args: {
        projects: sampleProjects,
        placeholder: 'Search in here',
        newProjectLabel: 'New project',
    },
    argTypes: {
        projects: { control: false },
        onSelect: { control: false },
        onNewProject: { control: false },
    },
};

export default meta;
type Story = StoryObj<typeof ProjectChoiceDropdown>;

const Preview = (args: ProjectChoiceDropdownProps) => {
    const [selected, setSelected] = useState<string | null>(null);
    return (
        <ProjectChoiceDropdown
            {...args}
            selectedProjectId={selected}
            onSelect={(p) => setSelected(p.id)}
            onNewProject={() => alert('Create new project!')}
        />
    );
};

export const Default: Story = {
    render: (args) => <Preview {...args} />,
};
