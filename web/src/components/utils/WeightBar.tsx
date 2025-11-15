import React, { useMemo } from 'react';

const colorChannelMixer = (colorChannelA: number, colorChannelB: number, amountToMix: number) => {
  let channelA = colorChannelA * amountToMix;
  let channelB = colorChannelB * (1 - amountToMix);
  return channelA + channelB;
};

const colorMixer = (rgbA: number[], rgbB: number[], amountToMix: number) => {
  let r = colorChannelMixer(rgbA[0], rgbB[0], amountToMix);
  let g = colorChannelMixer(rgbA[1], rgbB[1], amountToMix);
  let b = colorChannelMixer(rgbA[2], rgbB[2], amountToMix);
  return `rgb(${r}, ${g}, ${b})`;
};

const COLORS = {
  fillPrimary: [83, 182, 255],
  fillSecondary: [47, 125, 255],
  durabilityHigh: [98, 211, 142],
  durabilityMid: [255, 178, 71],
  durabilityLow: [255, 88, 88],
};

const WeightBar: React.FC<{ percent: number; durability?: boolean }> = ({ percent, durability }) => {
  const fillStyle = useMemo(() => {
    if (durability) {
      const ratio = Math.min(Math.max(percent, 0), 100) / 100;
      const start = percent < 50 ? COLORS.durabilityMid : COLORS.durabilityHigh;
      const end = percent < 50 ? COLORS.durabilityLow : COLORS.durabilityMid;
      return { background: colorMixer(start, end, ratio) };
    }

    return {
      background: `linear-gradient(90deg, ${colorMixer(COLORS.fillPrimary, COLORS.fillSecondary, 0.35)} 0%, ${colorMixer(
        COLORS.fillPrimary,
        COLORS.fillSecondary,
        0.9
      )} 100%)`,
    };
  }, [durability, percent]);

  return (
    <div className={durability ? 'durability-bar' : 'weight-bar'}>
      <div
        style={{
          visibility: percent > 0 ? 'visible' : 'hidden',
          height: '100%',
          width: `${Math.min(Math.max(percent, 0), 100)}%`,
          ...fillStyle,
          transition: `background ${0.3}s ease, width ${0.3}s ease`,
        }}
      ></div>
    </div>
  );
};
export default WeightBar;
