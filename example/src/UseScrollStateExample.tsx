import { Scroll, useScrollState } from 'scrollex';
import { Box, Center, chakra, HStack, Text } from '@chakra-ui/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { clamp } from './utils';

const MotionBox = motion(Box);
const MotionCenter = motion(Center);
const ScrollItem = chakra(Scroll.Item);
const ScrollSection = chakra(Scroll.Section);
const ScrollContainer = chakra(Scroll.Container);

const items = [1, 2, 3, 4];

const MenuPage = () => {
  const selectedIndex = useScrollState(({ section, position, container }) => {
    const index = Math.floor(
      (position - section.topAt('container-top')) /
        ((section.height - container.height) / items.length)
    );
    return clamp(index, 0, items.length - 1);
  });
  return (
    <MotionCenter
      h="100%"
      // bgGradient={'linear(to-b, pink.300, purple.300)'}
      // animate={{
      //   filter: `hue-rotate(${(selectedIndex || 0) * 90}deg)`,
      //   transition: { duration: 0.5 },
      // }}
    >
      <HStack spacing={12}>
        {items.map((item, index) => (
          <Box
            key={item}
            pos="relative"
            w="80px"
            h="80px"
            rounded="xl"
            bg="whiteAlpha.200"
            display="grid"
            placeItems="center"
            color="white"
          >
            {selectedIndex === index && (
              <MotionBox
                layoutId="selected"
                pos="absolute"
                inset={0}
                bg="pink.300"
                rounded="xl"
                zIndex={0}
              />
            )}
            <Text pos="relative" zIndex={1}>
              {item}
            </Text>
          </Box>
        ))}
      </HStack>
    </MotionCenter>
  );
};

export default function UseScrollStateExample() {
  return (
    <ScrollContainer scrollAxis="y" h="100vh">
      {/* <ScrollSection
        h="100vh"
        bg="blackAlpha.900"
        opacity={0.97}
      ></ScrollSection> */}
      <ScrollSection h="500vh">
        <Box pos="sticky" top={0} h="100vh" bg="blackAlpha.900">
          <MenuPage />
        </Box>
      </ScrollSection>
      {/* <ScrollSection
        h="100vh"
        bg="blackAlpha.900"
        opacity={0.97}
      ></ScrollSection> */}
    </ScrollContainer>
  );
}
