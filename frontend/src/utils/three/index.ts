// Main entry point for Three.js scene initialization
import { isWebGLAvailable } from "./webglDetection";
import { createParticleFallback } from "./particleFallback";
import { createEarthScene } from "./earthScene";

export function initEarthScene(containerId: string): (() => void) | undefined {
  if (!isWebGLAvailable()) {
    console.warn("WebGL not supported, using particle fallback animation");
    return createParticleFallback(containerId);
  }

  //WebGL Earth scene
  return createEarthScene(containerId);
}
