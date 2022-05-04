import { Scroll, useScrollState } from 'scrollex';
import { Box, Center, chakra, Heading, Img } from '@chakra-ui/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const ScrollItem = chakra(Scroll.Item);
const ScrollSection = chakra(Scroll.Section);
const ScrollContainer = chakra(Scroll.Container);

const Menu = () => {
  const index = useScrollState(({ section, position }) => {
    if (position < 100) {
      return 1;
    } else {
      return 2;
    }
  });

  return <h1>{index}</h1>;
};

export default function UseScrollStateExample() {
  return (
    <>
      <ScrollContainer scrollAxis="y" h="100vh">
        <ScrollSection showOverflow h="300vh">
          <Center pos="sticky" top={0} h="100vh" bg="blue.200">
            <Menu />
          </Center>
        </ScrollSection>
      </ScrollContainer>
    </>
  );
}
