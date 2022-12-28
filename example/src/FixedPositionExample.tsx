import { Scroll, Keyframes } from 'scrollex';
import { Center, chakra, Img } from '@chakra-ui/react';

const ScrollItem = chakra(Scroll.Item);
const ScrollSection = chakra(Scroll.Section);
const ScrollContainer = chakra(Scroll.Container);

const keyframes: Record<string, Keyframes> = {
  image: ({ section }) => ({
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
    <ScrollContainer scrollAxis="y" height="100vh">
      {images.map((image) => {
        return (
          <ScrollSection key={image} height="100vh">
            <Center
              pos="fixed"
              inset={0}
              pointerEvents="none"
              style={{ perspective: 600 }}
            >
              <ScrollItem keyframes={keyframes.image} overflow="hidden">
                <Img src={image} h="300px" w="200px" objectFit="cover" />
              </ScrollItem>
            </Center>
          </ScrollSection>
        );
      })}
    </ScrollContainer>
  );
}
