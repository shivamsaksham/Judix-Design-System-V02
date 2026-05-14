import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ScoreBox from "../components/block/score-box";

const meta: Meta<typeof ScoreBox> = {
  title: "Block/ScoreBox",
  component: ScoreBox,
};

export default meta;

type Story = StoryObj<typeof ScoreBox>;


export const Default: Story = {
  args: {
    title: "Score",
    score: "93.42%",
    subtitle: "Similar to Issues",
  },
};


export const HighScore: Story = {
  args: {
    title: "Score",
    score: "98.10%",
    subtitle: "Highly Similar",
  },
};


export const LowScore: Story = {
  args: {
    title: "Score",
    score: "41.20%",
    subtitle: "Low Similarity",
  },
};


export const ZeroScore: Story = {
  args: {
    title: "Score",
    score: "0%",
    subtitle: "No Similarity",
  },
};

export const WithInfo: Story = {
  args: {
    title: "Score",
    score: "93.42%",
    subtitle: "Similar to Issues",
    showInfo: true,
  },
};