"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

type GrainientProps = {
  color1: string;
  color2: string;
  color3: string;
  timeSpeed?: number;
  colorBalance?: number;
  warpStrength?: number;
  warpFrequency?: number;
  warpSpeed?: number;
  warpAmplitude?: number;
  blendAngle?: number;
  blendSoftness?: number;
  rotationAmount?: number;
  noiseScale?: number;
  grainAmount?: number;
  grainScale?: number;
  grainAnimated?: boolean;
  contrast?: number;
  gamma?: number;
  saturation?: number;
  centerX?: number;
  centerY?: number;
  zoom?: number;
};

export default function Grainient({
  color1,
  color2,
  color3,
  timeSpeed = 0.25,
  colorBalance = 0,
  warpStrength = 1,
  warpFrequency = 5,
  warpSpeed = 2,
  warpAmplitude = 50,
  blendAngle = 0,
  blendSoftness = 0.05,
  rotationAmount = 500,
  noiseScale = 0.75,
  grainAmount = 0.05,
  grainScale = 1,
  grainAnimated = false,
  contrast = 1.5,
  gamma = 1,
  saturation = 1,
  centerX = 0,
  centerY = 0,
  zoom = 0.9
}: GrainientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new Renderer({ canvas, alpha: false });
    const gl = renderer.gl;

    gl.clearColor(0, 0, 0, 1);

    const vertex = /* glsl */ `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragment = /* glsl */ `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      
      float rand(vec2 co) {
        return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        
        float t = uTime * ${timeSpeed};
        float mixer = sin(uv.x * ${warpFrequency} + t * ${warpSpeed}) * ${warpAmplitude / 100.0};
        
        vec3 color = mix(uColor1, uColor2, uv.y + mixer);
        color = mix(color, uColor3, uv.x * ${colorBalance + 0.5});
        
        float grain = rand(uv * ${grainScale}) * ${grainAmount};
        color += grain;
        
        color = pow(color, vec3(${gamma}));
        color = (color - 0.5) * ${contrast} + 0.5;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const hexToRgb = (hex: string): [number, number, number] => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? [
            parseInt(result[1], 16) / 255,
            parseInt(result[2], 16) / 255,
            parseInt(result[3], 16) / 255
          ]
        : [0, 0, 0];
    };

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [canvas.width, canvas.height] },
        uColor1: { value: hexToRgb(color1) },
        uColor2: { value: hexToRgb(color2) },
        uColor3: { value: hexToRgb(color3) }
      }
    });

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    let animationFrame: number;

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      program.uniforms.uResolution.value = [canvas.width, canvas.height];
    };

    window.addEventListener("resize", resize);
    resize();

    const animate = (time: number) => {
      animationFrame = requestAnimationFrame(animate);
      program.uniforms.uTime.value = time * 0.001;
      renderer.render({ scene: mesh });
    };

    animate(0);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    color1,
    color2,
    color3,
    timeSpeed,
    colorBalance,
    warpFrequency,
    warpSpeed,
    warpAmplitude,
    grainAmount,
    grainScale,
    contrast,
    gamma
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
