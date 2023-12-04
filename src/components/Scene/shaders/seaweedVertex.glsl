uniform float uTime;
uniform float uAmplitude;
uniform float uFrequency;
uniform float uBend;
uniform float uWindVelocity;
uniform vec3 uPos;
uniform float uRand;

attribute vec3 rotation;
attribute float scale;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float speed = (uTime + uRand) * uWindVelocity;
    // float dist = distance(modelPosition.xz, uPos.xz);
    float dist = distance(modelPosition.xz, uPos.xz);
    float elevation = sin(dist * uFrequency + speed ) * sin(dist) * uAmplitude;
    elevation += sin(distance(modelPosition.y, uPos.y) * 8.0 + speed ) * sin(dist) * uAmplitude;
    modelPosition.y += elevation;


    modelPosition.z += sin((pow(modelPosition.y, 2.0) * uBend) * sin(uTime * uWindVelocity));


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    csm_PositionRaw = projectedPosition;
}