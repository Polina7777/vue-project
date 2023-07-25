
varying vec3 eye;
varying vec3 vNormal;
varying vec3 vReflect;

uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2d texture2;
varying vec2 pixels;
varying vec2 uvRate1;
varying vec2 accel;
varying vec4 vPosition;


void main()	{
gl_FragColor = vec4(1.0,0.0,0.0,1.);
}