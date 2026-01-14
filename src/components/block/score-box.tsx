import React from "react";
import {Icon} from "judix-icon";

export type ScoreBoxProps = {
  title: string;
  score: string;
  subtitle: string;
};

function ScoreBox({ title, score, subtitle }: ScoreBoxProps) {
  return (
      <div className="flex w-[140px] h-[70px] flex-col items-center justify-center gap-2
            pt-1 pr-2 pb-2 pl-2
            rounded-label-border-radius-default
            border border-color-border-primary-strong
            bg-color-surface-neutral-default"> 
        {/* Score */}
        <div className="flex flex-col items-center">
            {/* Frame 5974 */}

            <div className="flex content-center items-center gap-1">
                {/* 5976 */}
                <div className="flex p-1 content-center items-center gap-2">
                    {/* Frame 5972 */}
                    <p className="text-color-text-primary-default 
                    font-satoshi text-style-textblock-secondary-largetext-bold">{score}</p> 
                    {/* TODO: this text-style class giving semibold from Global css, but we want bold.
                        Also its not loading the satoshi fonts */}
                </div>

                <div className="flex w-[20px] h-[20px] content-center items-center aspect-square">
                    {/* ! Icon */}
                    <Icon name="InfoCircle" className="flex w-5 h-5 items-center justify-center 
                    aspect-square text-color-icon-primary-default"  />
                </div>
            </div>



            <div className="flex p-1 content-center items-center gap-2">
                {/* 5971 */}
                <p className="text-color-color-text-neutral-secondary text-style-label-title-regular">{subtitle}</p>
            </div>
        </div>
      </div>
  );
}

export default ScoreBox;
