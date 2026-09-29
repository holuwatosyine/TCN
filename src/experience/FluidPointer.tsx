import { useEffect } from "react";
import { ChromaFlow, CursorRipples, DotGrid, LinearGradient } from "shaders/react";
import ShaderSurface from "@/components/effects/ShaderSurface";
import { experienceState } from "@/experience/state";

const FluidPointer = () => {
  useEffect(() => {
    experienceState.markReady("fluid");
  }, []);

  if (experienceState.reducedMotion) return null;

  return (
    <div className="kh-shader-cursor" aria-hidden="true">
      <ShaderSurface className="kh-shader-cursor__canvas">
        <DotGrid
          id="trailDots"
          density={40}
          dotSize={{
            type: "map",
            source: "trailFlow",
            channel: "alpha",
            inputMax: 1,
            inputMin: 0,
            outputMax: 1,
            outputMin: 0,
          }}
          twinkle={0.9}
          visible={false}
        />
        <ChromaFlow id="trailFlow" intensity={1.4} radius={2.9} visible={false} />
        <LinearGradient
          colorA="#1e1e1f"
          colorB="#070708"
          colorSpace="hsl"
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 1 }}
        />
        <LinearGradient
          colorA="#000000"
          colorB="#ffffff"
          colorSpace="hsl"
          end={{ x: 1, y: 0 }}
          maskSource="trailDots"
          start={{ x: 0, y: 1 }}
        />
        <CursorRipples />
      </ShaderSurface>
    </div>
  );
};

export default FluidPointer;
