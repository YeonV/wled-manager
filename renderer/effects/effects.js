import GradientRolling from "./gradientRolling";
import GradientAudio from "./gradientsAudio";
import GradientStatic from "./gradientStatic";
import Power from "./power";
import Wavelength from "./wavelength";
import WavelengthBg from "./wavelengthBg";

export const effects = [
    'Power (Left FB)',
    'Wavelength (Range)',
    'WavelengthBg (Range)',
    'GradientStatic',
    'GradientRolling',
    'GradientAudio',
]

const Effect = ({ type, config }) => {
    switch (type) {
        case 'Power (Left FB)':
            return Power(config)

        case 'Wavelength (Range)':
            return Wavelength(config)

        case 'WavelengthBg (Range)':
            return WavelengthBg(config)

        case 'GradientStatic':
            return GradientStatic(config)

        case 'GradientRolling':
            return GradientRolling(config)
            
        case 'GradientAudio':
            return GradientAudio(config)

        default:
            return Power(config)
    }
}

export default Effect