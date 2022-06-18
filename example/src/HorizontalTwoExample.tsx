import { Scroll, Keyframes, SpringConfigs } from 'scrollex';
import { chakra, Img, Box } from '@chakra-ui/react';

const ScrollItem = chakra(Scroll.Item);
const ScrollSection = chakra(Scroll.Section);
const ScrollContainer = chakra(Scroll.Container);

const keyframes: Record<string, Keyframes> = {
  image: ({ section, container }) => ({
    [section.rightAt('container-right') - container.width]: {
      translateX: -100,
    },
    [section.leftAt('container-left') + container.width]: {
      translateX: 100,
    },
  }),
};

const springs: SpringConfigs = {
  translateX: {
    mass: 0.1,
    stiffness: 200,
    damping: 20,
  },
};

const images = [
  'https://picsum.photos/id/334/400/600',
  'https://picsum.photos/id/239/400/600',
  'https://picsum.photos/id/238/400/600',
  'https://picsum.photos/id/212/400/600',
  'https://picsum.photos/id/213/400/600',
  'https://picsum.photos/id/214/400/600',
  'https://picsum.photos/id/215/400/600',
  'https://picsum.photos/id/116/400/600',
  'https://picsum.photos/id/117/400/600',
];

export default function App() {
  return (
    <ScrollContainer
      scrollAxis="x"
      throttleAmount={0}
      width="100vw"
      height="100vh"
      px={4}
    >
      {images.map((image) => {
        return (
          <ScrollSection key={image} height="100vh" mx={4}>
            <Box h="100%" display="inline-flex" alignItems="center">
              <Box overflow="hidden">
                <ScrollItem keyframes={keyframes.image} springs={springs}>
                  <Img
                    key={image}
                    src={image}
                    h="300px"
                    w="200px"
                    objectFit="cover"
                    transform="scale(2)"
                  />
                </ScrollItem>
              </Box>
            </Box>
          </ScrollSection>
        );
      })}
    </ScrollContainer>
  );
}
