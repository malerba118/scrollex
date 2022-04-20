import { Parallax, Keyframes } from 'scrollex';
import { Center, chakra, Heading, Img } from '@chakra-ui/react';

const ParallaxItem = chakra(Parallax.Item);
const ParallaxSection = chakra(Parallax.Section);

const keyframes: Record<string, Keyframes> = {
  heading: ({ section }) => ({
    [section.topAt('container-top')]: {
      rotateZ: 0,
      translateY: 0,
    },
    [section.bottomAt('container-top')]: {
      rotateZ: 180,
      translateY: section.height,
    },
  }),
  single: ({ section }) => ({
    [section.topAt('container-top')]: {
      translateX: 300,
    },
  }),
};

export default function App() {
  return (
    <Parallax.Container scrollAxis="y" height="100vh" width="100vw">
      <ParallaxSection height="300px">
        <ParallaxItem>
          <Heading size="4xl">Yo</Heading>
        </ParallaxItem>
      </ParallaxSection>
      <ParallaxSection h="300px" bg="green.200">
        <ParallaxItem keyframes={keyframes.single}>
          <Heading size="4xl">What's</Heading>
        </ParallaxItem>
      </ParallaxSection>
      <ParallaxSection
        h="300px"
        bg="red.200"
        m="100px"
        p="25px"
        border="25px solid red"
      >
        <ParallaxItem keyframes={keyframes.heading} display="inline-block">
          <Heading display="inline-block" size="4xl">
            Up
          </Heading>
        </ParallaxItem>
      </ParallaxSection>
      <ParallaxSection h="300px">
        <ParallaxItem>
          <Heading size="4xl">How's</Heading>
        </ParallaxItem>
      </ParallaxSection>
      <ParallaxSection h="300px" bg="green.200">
        <ParallaxItem display="inline-block" keyframes={keyframes.heading}>
          <Heading display="inline-block" size="4xl">
            It
          </Heading>
        </ParallaxItem>
      </ParallaxSection>
      <ParallaxSection h="300px">
        <ParallaxItem>
          <Heading size="4xl">Going</Heading>
        </ParallaxItem>
      </ParallaxSection>
      <ParallaxSection h="300px">
        <ParallaxItem>
          <Heading size="4xl">?</Heading>
        </ParallaxItem>
      </ParallaxSection>
    </Parallax.Container>
  );
}
