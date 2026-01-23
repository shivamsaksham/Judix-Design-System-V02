import type { Meta, StoryObj } from "@storybook/react";
import ScoreBox from "../components/block/score-box";

const meta: Meta<typeof ScoreBox> = {
  title: "Block/ScoreBox",
  component: ScoreBox,
};

export default meta;

type Story = StoryObj<typeof ScoreBox>;

/* ---------------- Default ---------------- */

export const Default: Story = {
  args: {
    title: "Score",
    score: "93.42%",
    subtitle: "Similar to Issues",
  },
};

/* ---------------- High Score ---------------- */

export const HighScore: Story = {
  args: {
    title: "Score",
    score: "98.10%",
    subtitle: "Highly Similar",
  },
};

/* ---------------- Low Score ---------------- */

export const LowScore: Story = {
  args: {
    title: "Score",
    score: "41.20%",
    subtitle: "Low Similarity",
  },
};

/* ---------------- Edge Case: Zero ---------------- */

export const ZeroScore: Story = {
  args: {
    title: "Score",
    score: "0%",
    subtitle: "No Similarity",
  },
};
