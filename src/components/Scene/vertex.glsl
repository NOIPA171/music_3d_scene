uniform float uTime;
uniform vec3 uColor;
uniform float uBend;
uniform float uWindVelocity;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin((modelPosition.y * modelPosition.y * uBend) * sin(uTime * uWindVelocity));

    modelPosition.z += elevation;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // is csm_PositionRaw for CustomShaderMaterial
    // gl_Position = projectedPosition;
    csm_PositionRaw = projectedPosition;
}