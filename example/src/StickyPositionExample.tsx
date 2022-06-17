import { Scroll, Keyframes } from 'scrollex';
import { Box, Center, chakra, Heading, Img } from '@chakra-ui/react';

const ScrollItem = chakra(Scroll.Item);
const ScrollSection = chakra(Scroll.Section);
const ScrollContainer = chakra(Scroll.Container);

const keyframes: Record<string, Keyframes> = {
  headerText: ({ section }) => ({
    [section.topAt('container-top')]: {
      translateY: 0,
      backgroundColor: '#ff00ff',
    },
    [section.bottomAt('container-top')]: {
      translateY: 200,
      backgroundColor: 'rgba(255,0,0,1)',
    },
  }),
  headerImage: ({ section }) => ({
    [section.topAt('container-top')]: {
      translateY: 0,
    },
    [section.bottomAt('container-top')]: {
      translateY: 125,
    },
  }),
  galleryImage: ({ section, data }) => ({
    [section.topAt('container-top')]: {
      translateZ: data.initialZ,
    },
    [section.bottomAt('container-bottom')]: {
      translateZ: data.initialZ + 510,
    },
  }),
  footerText: ({ section }) => ({
    [section.topAt('container-bottom')]: {
      translateY: 200,
    },
    [section.bottomAt('container-bottom')]: {
      translateY: 0,
    },
  }),
};

const images = [
  {
    x: -600,
    y: -500,
    z: -200,
    src: 'https://picsum.photos/id/121/600/600',
  },
  {
    x: 600,
    y: -500,
    z: -100,
    src: 'https://picsum.photos/id/146/600/600',
  },
  {
    x: 0,
    y: -100,
    z: 0,
    src: 'https://picsum.photos/id/152/1000/600',
  },
  {
    x: -450,
    y: 300,
    z: 100,
    src: 'https://picsum.photos/id/235/600/600',
  },
  {
    x: 400,
    y: 250,
    z: 200,
    src: 'https://picsum.photos/id/311/1000/800',
  },
];

export default function App() {
  return (
    <ScrollContainer
      scrollAxis="y"
      height="100vh"
      bg="rgba(20, 19, 21, .96)"
      color="whatsapp.400"
    >
      <ScrollSection h="100vh">
        <ScrollItem keyframes={keyframes.headerImage} pos="absolute" inset={0}>
          <Img
            src="https://picsum.photos/id/209/2000/1000"
            objectFit="cover"
            h="100%"
            w="100%"
            transform="scale(1.25)"
          />
        </ScrollItem>
        <Center h="100%">
          <ScrollItem keyframes={keyframes.headerText}>
            <Heading fontSize="9xl">Skrolify</Heading>
          </ScrollItem>
        </Center>
      </ScrollSection>
      <ScrollSection showOverflow height="500vh">
        <Box
          pos="sticky"
          top={0}
          h="100vh"
          style={{ perspective: 600 }}
          overflow="hidden"
        >
          {images.map((image) => {
            return (
              <ScrollItem
                key={image.src}
                keyframes={keyframes.galleryImage}
                pos="absolute"
                inset={0}
                display="grid"
                placeItems="center"
                left={image.x}
                top={image.y}
                data={{ initialZ: image.z }}
              >
                <Img src={image.src} h="250px" objectFit="cover" />
              </ScrollItem>
            );
          })}
        </Box>
      </ScrollSection>
      <ScrollSection h="100vh">
        <Center h="100%">
          <ScrollItem keyframes={keyframes.footerText}>
            <Heading fontSize="9xl">Skrolify</Heading>
          </ScrollItem>
        </Center>
      </ScrollSection>
    </ScrollContainer>
  );
}
