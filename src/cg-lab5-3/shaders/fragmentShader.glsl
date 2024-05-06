uniform vec3 topColor;
uniform vec3 bottomColor;

varying vec2 vUv;

void main() {
  gl_FragColor = vec4(mix(bottomColor, topColor, vUv.y), 1.0);
}