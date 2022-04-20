import { Parallax, Keyframes } from 'scrollex';
import { Center, chakra, Img } from '@chakra-ui/react';

const ParallaxItem = chakra(Parallax.Item);
const ParallaxSection = chakra(Parallax.Section);

const keyframes: Record<string, Keyframes> = {
  image: ({ section, container, scrollMax }) => ({
    [section.topAt('container-bottom')]: {
      translateY: 125,
      translateX: -250,
      opacity: 0,
      rotateX: -25,
      rotateY: -50,
      scale: 0.4,
    },
    [section.topAt('container-top')]: {
      translateY: 0,
      translateX: 0,
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      scale: 1.3,
    },
    [section.bottomAt('container-top')]: {
      translateY: -125,
      translateX: 250,
      opacity: 0,
      rotateX: 25,
      rotateY: 50,
      scale: 0.4,
    },
  }),
};

const images = [
  'https://picsum.photos/id/237/200/300',
  'https://picsum.photos/id/238/200/300',
  'https://picsum.photos/id/239/200/300',
  'https://picsum.photos/id/212/200/300',
  'https://picsum.photos/id/213/200/300',
  'https://picsum.photos/id/214/200/300',
  'https://picsum.photos/id/215/200/300',
  'https://picsum.photos/id/216/200/300',
  'https://picsum.photos/id/217/200/300',
];

export default function App() {
  return (
    <Parallax.Container scrollAxis="y" height="100vh" width="100vw">
      {images.map((image) => {
        return (
          <ParallaxSection key={image} height="100vh">
            <Center
              pos="fixed"
              inset={0}
              pointerEvents="none"
              style={{ perspective: 600 }}
            >
              <ParallaxItem keyframes={keyframes.image} overflow="hidden">
                <Img
                  key={image}
                  src={image}
                  h="300px"
                  w="200px"
                  objectFit="cover"
                />
              </ParallaxItem>
            </Center>
          </ParallaxSection>
        );
      })}
    </Parallax.Container>
  );
}
