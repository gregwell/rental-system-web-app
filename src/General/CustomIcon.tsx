import DownhillSkiingIcon from "@mui/icons-material/DownhillSkiing";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import SnowboardingIcon from "@mui/icons-material/Snowboarding";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ElectricScooterIcon from "@mui/icons-material/ElectricScooter";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import ElectricBikeIcon from "@mui/icons-material/ElectricBike";
import KayakingIcon from '@mui/icons-material/Kayaking';

import { ItemType } from "./types";

interface CustomIconProps {
  type: ItemType;
}

export const CustomIcon = ({ type }: CustomIconProps) => {
  switch (type) {
    case ItemType.ski:
      return <DownhillSkiingIcon />;
    case ItemType.snowboard:
      return <SnowboardingIcon />;
    case ItemType.car:
      return <DirectionsCarIcon />;
    case ItemType.scooter:
      return <ElectricScooterIcon />;
    case ItemType.bike:
      return <PedalBikeIcon />;
    case ItemType.electricBike:
      return <ElectricBikeIcon />;
    case ItemType.kayak:
      return <KayakingIcon/>;
    default:
      return <DevicesOtherIcon />;
  }
};

export default CustomIcon;
