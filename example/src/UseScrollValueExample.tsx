import { Scroll, useScrollState, useScrollValue } from 'scrollex';
import { Box, Center, chakra } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const ScrollSection = chakra(Scroll.Section);
const ScrollContainer = chakra(Scroll.Container);

const items = [1, 2, 3, 4];

const ScrollyBox = () => {
  const x = useScrollValue(({ velocity }) => {
    return velocity / 35;
  });

  const rotate = useScrollValue(({ velocity }) => {
    const v = velocity / 35;
    return v;
  });

  const direction = useScrollState(({ velocity }) => {
    if (velocity > 0) {
      return 'down';
    } else if (velocity < 0) {
      return 'up';
    }
    return null;
  });

  return (
    <MotionBox
      w="64px"
      h="64px"
      rounded="xl"
      bg={direction === 'up' ? 'blue.300' : 'pink.300'}
      style={{ x, rotate }}
    />
  );
};

export default function UseScrollStateExample() {
  return (
    <ScrollContainer scrollAxis="y" h="100vh">
      <ScrollSection h="500vh">
        <Center pos="sticky" top={0} h="100vh" bg="blackAlpha.900">
          <ScrollyBox />
        </Center>
      </ScrollSection>
    </ScrollContainer>
  );
}
