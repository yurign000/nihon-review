import { Configuration } from "./defaultConfiguration";

export default interface RootContext {
    configuration:    Configuration;
    setConfiguration: React.Dispatch<React.SetStateAction<Configuration>>
    setChangedURL:    React.Dispatch<React.SetStateAction<boolean>>;
};