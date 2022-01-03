import DownhillSkiingIcon from "@mui/icons-material/DownhillSkiing";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import SnowboardingIcon from "@mui/icons-material/Snowboarding";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ElectricScooterIcon from "@mui/icons-material/ElectricScooter";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import ElectricBikeIcon from "@mui/icons-material/ElectricBike";
import KayakingIcon from "@mui/icons-material/Kayaking";
import { makeStyles } from "@mui/styles";
import { ItemType } from "../constants/types";

const useStyles = makeStyles({
  icon: {
    transform: (makeStylesProps: { scale: string }) =>
      `scale(${makeStylesProps.scale})`,
  },
});

interface CustomIconProps {
  type: ItemType;
  scale?: string;
}

export const CustomIcon = ({ type, scale }: CustomIconProps) => {
  const makeStylesProps = {
    scale: scale ? scale : "",
  };

  const classes = useStyles(makeStylesProps);

  const className = scale ? classes.icon : undefined;

  switch (type) {
    case ItemType.ski:
      return <DownhillSkiingIcon className={className} />;
    case ItemType.snowboard:
      return <SnowboardingIcon className={className} />;
    case ItemType.car:
      return <DirectionsCarIcon className={className} />;
    case ItemType.scooter:
      return <ElectricScooterIcon className={className} />;
    case ItemType.bike:
      return <PedalBikeIcon className={className} />;
    case ItemType.electricBike:
      return <ElectricBikeIcon className={className} />;
    case ItemType.kayak:
      return <KayakingIcon className={className} />;
    default:
      return <DevicesOtherIcon className={className} />;
  }
};

export default CustomIcon;
