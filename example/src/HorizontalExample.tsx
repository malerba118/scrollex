import { Scroll, Keyframes } from 'scrollex';
import { Center, chakra, Heading, Img } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const ScrollItem = chakra(Scroll.Item);
const ScrollSection = chakra(Scroll.Section);
const ScrollContainer = chakra(Scroll.Container);

const keyframes: Record<string, Keyframes> = {
  heading: ({ section, maxScrollPosition }) => ({
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
    <>
      <ScrollContainer scrollAxis="x" h="100vh">
        <ScrollSection w="100vw" bg="blue.200" style={{ perspective: 500 }}>
          <ScrollItem display="inline-block" keyframes={keyframes.heading}>
            <Heading display="inline-block" size="4xl">
              Yo
            </Heading>
          </ScrollItem>
        </ScrollSection>
        <ScrollSection w="100vw" bg="green.200">
          <ScrollItem
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
          </ScrollItem>
        </ScrollSection>
        <ScrollSection w="100vw" bg="pink.200">
          <ScrollItem display="inline-block" keyframes={keyframes.heading}>
            <Heading display="inline-block" size="4xl">
              Up
            </Heading>
          </ScrollItem>
        </ScrollSection>
        <ScrollSection w="100vw" bg="orange.200">
          <ScrollItem display="inline-block" keyframes={keyframes.heading}>
            <Heading display="inline-block" size="4xl">
              ?
            </Heading>
          </ScrollItem>
        </ScrollSection>
        <ScrollSection w="100vw" bg="orange.200">
          <ScrollItem display="inline-block" keyframes={keyframes.heading}>
            <Heading display="inline-block" size="4xl">
              ?
            </Heading>
          </ScrollItem>
        </ScrollSection>
      </ScrollContainer>
    </>
  );
}
