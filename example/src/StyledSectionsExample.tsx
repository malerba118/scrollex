import { Scroll, Keyframes } from 'scrollex';
import { Box, chakra, Heading, Img } from '@chakra-ui/react';

const ScrollItem = chakra(Scroll.Item);
const ScrollSection = chakra(Scroll.Section);
const ScrollContainer = chakra(Scroll.Container);

const keyframes: Record<string, Keyframes> = {
  heading: ({ section }) => ({
    [section.topAt('container-top')]: {
      rotateZ: 0,
      translateY: 0,
    },
    [section.bottomAt('container-top') - 110]: {
      color: 'rgba(255,0,255,1)',
    },
    [section.bottomAt('container-top') - 100]: {
      rotateZ: 180,
      translateY: section.height - 150,
      color: 'rgba(255,0,0,1)',
    },
  }),
  single: ({ section }) => ({
    [section.topAt('container-top')]: {
      translateX: 300,
    },
  }),
  questionMark: ({ section, container, maxScrollPosition }) => ({
    [maxScrollPosition - 100]: {
      rotateZ: 0,
      translateY: 0,
    },
    [maxScrollPosition]: {
      rotateZ: 180,
      translateY: 1000,
    },
  }),
};

export default function App() {
  return (
    <ScrollContainer scrollAxis="y" height="100vh" throttleAmount={0}>
      <ScrollSection
        pos="absolute"
        inset={0}
        bg="red.100"
        zIndex={-1}
      ></ScrollSection>
      <ScrollSection height="300px">
        <ScrollItem>
          <Heading size="4xl">Yo</Heading>
        </ScrollItem>
      </ScrollSection>
      <ScrollSection h="300px" bg="green.200">
        <ScrollItem keyframes={keyframes.single}>
          <Heading size="4xl">What's</Heading>
        </ScrollItem>
      </ScrollSection>
      <ScrollSection
        h="300px"
        bg="red.200"
        m="100px"
        p="25px"
        border="25px solid red"
      >
        <ScrollItem
          color="orange"
          keyframes={keyframes.heading}
          display="inline-block"
        >
          <Heading display="inline-block" size="4xl">
            Up
          </Heading>
        </ScrollItem>
      </ScrollSection>
      <ScrollSection h="300px">
        <ScrollItem>
          <Heading size="4xl">How's</Heading>
        </ScrollItem>
      </ScrollSection>
      <ScrollSection h="300px" bg="green.200">
        <ScrollItem display="inline-block" keyframes={keyframes.heading}>
          <Heading display="inline-block" size="4xl">
            It
          </Heading>
        </ScrollItem>
      </ScrollSection>
      <ScrollSection h="300px">
        <ScrollItem>
          <Heading size="4xl">Going</Heading>
        </ScrollItem>
      </ScrollSection>
      <Box h="500vh" />
      <ScrollSection h="300px">
        <ScrollItem keyframes={keyframes.questionMark}>
          <Heading size="4xl">?</Heading>
        </ScrollItem>
      </ScrollSection>
    </ScrollContainer>
  );
}
