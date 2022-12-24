import { useSpring, useSprings } from "@react-spring/three";
import {
  Center,
  GradientTexture,
  Stars,
  Text3D,
  OrbitControls,
} from "@react-three/drei";
import { useChain, useSpringRef, animated } from "@react-spring/three";
import { extend } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { Group, PointLight } from "three";
import { UnrealBloomPass } from "three-stdlib";
import {
  EffectComposer,
  SelectiveBloom,
  Selection,
  Select,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize, Resolution } from "postprocessing";
import { useRouter } from "next/navigation";
import bladeFontJSON from "../../utils/three/blade.json";
import { useMediaQuery } from "../../utils/hooks/useMediaQuery";
extend({ UnrealBloomPass });

const circles = [
  {
    color: "#f51a36",
    position: [10, 10, 10],
  },
  {
    color: "#c917ac",
    position: [-10, 10, -10],
  },
  {
    color: "#b517cb",
    position: [0, -10, 0],
  },
];

const AnimatedCenter = animated(Center);

export function Background() {
  const router = useRouter();

  const [sceneSizes, setSceneSizes] = useState({
    minZoom: 5,
    maxZoom: 10,
    spheresSize: 0.2,
    textSize: 0.2,
    descriptionOffset: -0.5,
  });

  const mergeScene = useCallback(
    (scene: Partial<typeof sceneSizes>) => {
      setSceneSizes((state) => {
        return { ...state, ...scene };
      });
    },
    [setSceneSizes]
  );

  const smMatches = useMediaQuery("(min-width:600px)");
  const mdMatches = useMediaQuery("(min-width:768px)");

  useEffect(() => {
    if (mdMatches)
      mergeScene({
        textSize: 0.5,
        spheresSize: 0.3,
        descriptionOffset: -1,
      });
    else if (smMatches)
      mergeScene({
        spheresSize: 0.3,
        textSize: 0.35,
        descriptionOffset: -0.7,
      });
    else
      mergeScene({
        minZoom: 5,
        maxZoom: 10,
        spheresSize: 0.2,
        textSize: 0.2,
        descriptionOffset: -0.5,
      });
  }, [smMatches, mdMatches, mergeScene]);

  const centerRef = useRef<Group>(null);

  const lightRef = useRef<PointLight>(null);

  const springsRef = useSpringRef();
  const [springs] = useSprings(circles.length, (index) => {
    const circle = circles[index];
    return {
      ref: springsRef,
      from: { position: circle.position },
      to: { position: [0, 0, 0] },
      config: {
        duration: 2000,
      },
    };
  });
  const textScaleRef = useSpringRef();

  const [{ visible, ...textScaleSpring }] = useSpring(() => ({
    ref: textScaleRef,
    from: { scale: 0, visible: true },
    to: { scale: 1, visible: false },
  }));

  useChain([springsRef, textScaleRef]);
  return (
    <>
      <Selection>
        <EffectComposer>
          <SelectiveBloom
            lights={lightRef}
            luminanceThreshold={0}
            luminanceSmoothing={0.1}
            width={Resolution.AUTO_SIZE}
            height={Resolution.AUTO_SIZE}
            kernelSize={KernelSize.LARGE}
            blendFunction={BlendFunction.SCREEN}
          />
        </EffectComposer>
        <Select enabled>
          {springs.map((item, index) => {
            const circle = circles[index];
            return (
              // @ts-ignore
              <animated.mesh key={index} visible={visible} {...item}>
                <sphereGeometry
                  args={[sceneSizes.spheresSize]}
                ></sphereGeometry>
                <meshPhongMaterial
                  shininess={1}
                  color={circle.color}
                ></meshPhongMaterial>
              </animated.mesh>
            );
          })}
          <AnimatedCenter
            ref={centerRef}
            position={[0, 0, 0]}
            {...textScaleSpring}
          >
            <Text3D
              position={[0, 0, 0]}
              size={sceneSizes.textSize}
              font={bladeFontJSON as any}
            >
              bashcrashers
              <meshStandardMaterial>
                <GradientTexture
                  stops={[0, 0.8, 1]}
                  colors={["#f51a36", "#c917ac", "#b517cb"]}
                ></GradientTexture>
              </meshStandardMaterial>
            </Text3D>
          </AnimatedCenter>
        </Select>
      </Selection>
      <AnimatedCenter
        ref={centerRef}
        position={[0, sceneSizes.descriptionOffset, 0]}
        {...textScaleSpring}
      >
        <Text3D
          font={bladeFontJSON as any}
          size={sceneSizes.textSize * 0.85}
          onClick={() => {
            router.push("/banner");
            document.body.classList.remove("cursor-pointer");
          }}
          onPointerEnter={() => document.body.classList.add("cursor-pointer")}
          onPointerLeave={() =>
            document.body.classList.remove("cursor-pointer")
          }
        >
          genera tu banner ahora
          <meshLambertMaterial color={"#fff"}></meshLambertMaterial>
        </Text3D>
      </AnimatedCenter>
      <pointLight
        ref={lightRef}
        position={[0, 0, 10]}
        intensity={2}
      ></pointLight>
      <Stars fade saturation={100}></Stars>
      <OrbitControls
        makeDefault
        enableDamping={false}
        enablePan={false}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
        minPolarAngle={Math.PI / 4}
        minDistance={sceneSizes.minZoom}
        maxDistance={sceneSizes.maxZoom}
      ></OrbitControls>
    </>
  );
}
