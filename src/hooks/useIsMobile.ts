import useWindowDimensions from './useWindowDimensions';

export const useIsMobile = () => {
  const { windowWidth } = useWindowDimensions();
  const isMobile = !!windowWidth && windowWidth <= 768;

  return isMobile;
};
