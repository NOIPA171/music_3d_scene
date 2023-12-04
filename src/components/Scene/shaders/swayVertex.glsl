uniform float uTime;
uniform float uBend;
uniform float uWindVelocity;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin((pow(modelPosition.y, 2.0) * uBend) * sin(uTime * uWindVelocity));

    modelPosition.z += elevation;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // is csm_PositionRaw for CustomShaderMaterial
    // gl_Position = projectedPosition;
    csm_PositionRaw = projectedPosition;
}