import { Parallax, Keyframes } from 'scrollex';
import { Center, chakra, Heading, Img } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const ParallaxItem = chakra(Parallax.Item);
const ParallaxSection = chakra(Parallax.Section);

const keyframes: Record<string, Keyframes> = {
  heading: ({ section, scrollMax }) => ({
    [section.leftAt('container-left')]: {
      rotateZ: 0,
      translateY: 0,
      translateX: 0,
      scale: 1,
      skewX: 10,
    },
    [section.rightAt('container-left')]: {
      rotateZ: 180,
      translateY: section.height,
      translateX: section.width,
      scale: 4,
      skewX: -10,
    },
  }),
};

export default function App() {
  const [mass, setMass] = useState(2);
  useEffect(() => {
    setTimeout(() => {
      setMass(0.2);
    }, 10000);
  }, []);
  return (
    <Parallax.Container scrollAxis="x" height="100vh" width="100vw">
      <ParallaxSection w="100vw" bg="blue.200" style={{ perspective: 500 }}>
        <ParallaxItem display="inline-block" keyframes={keyframes.heading}>
          <Heading display="inline-block" size="4xl">
            Yo
          </Heading>
        </ParallaxItem>
      </ParallaxSection>
      <ParallaxSection w="100vw" bg="green.200">
        <ParallaxItem
          display="inline-block"
          keyframes={keyframes.heading}
          springs={{ rotateZ: { mass } }}
        >
          <Heading display="inline-block" size="4xl">
            What's
          </Heading>
          <Heading w="300px">
            test test test test test test test test test test test test
            whitespace normal
          </Heading>
        </ParallaxItem>
      </ParallaxSection>
      <ParallaxSection w="100vw" bg="pink.200">
        <ParallaxItem display="inline-block" keyframes={keyframes.heading}>
          <Heading display="inline-block" size="4xl">
            Up
          </Heading>
        </ParallaxItem>
      </ParallaxSection>
      <ParallaxSection w="100vw" bg="orange.200">
        <ParallaxItem display="inline-block" keyframes={keyframes.heading}>
          <Heading display="inline-block" size="4xl">
            ?
          </Heading>
        </ParallaxItem>
      </ParallaxSection>
    </Parallax.Container>
  );
}
