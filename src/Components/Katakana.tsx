import { Configuration } from "../scripts/defaultConfiguration";
interface Config {
    config_t: Configuration;
    setConfig_t: React.Dispatch<React.SetStateAction<Configuration>>;
}

export default function Katakana(props: Config){
    // HABILITAR/DESABILITAR CHECKBOX
    const setCheck = (value: string): boolean => {
        if(props.config_t.katakana.sets_to_show.includes(value)) 
            return true 
        return false
    }

    // SALVAR CHECKBOXS MARCADOS NO LOCALSTORAGE
    const handleCheck = (value: string) => {
        let sets: string[] = props.config_t.katakana.sets_to_show;

        if(setCheck(value)){
            sets.splice(sets.indexOf(value), 1);

            props.setConfig_t({...props.config_t, katakana: {
                sets_to_show: sets 
            }})
        }
        else props.setConfig_t({...props.config_t, katakana: {sets_to_show: [
            ...props.config_t.katakana.sets_to_show, value
        ]}})
    }

    return (
        <>
            <div>
                <input checked={setCheck('group a')} onChange={() => handleCheck('group a')}  type="checkbox"/> 
                <label>ア</label>
            </div>
            <div>
                <input checked={setCheck('group h')} onChange={() => handleCheck('group h')} type="checkbox"/> 
                <label>ハ</label>
            </div>
            <div>
                <input checked={setCheck('group t')} onChange={() => handleCheck('group t')} type="checkbox"/> 
                <label>タ</label>
            </div>
            <div>
                <input checked={setCheck('group k')} onChange={() => handleCheck('group k')} type="checkbox"/> 
                <label>カ</label>
            </div>
            <div>
                <input checked={setCheck('group n')} onChange={() => handleCheck('group n')}  type="checkbox"/> 
                <label>ナ</label>
            </div>
            <div>
                <input checked={setCheck('group m')} onChange={() => handleCheck('group m')}  type="checkbox"/> 
                <label>マ</label>
            </div>
            <div>
                <input checked={setCheck('group r')} onChange={() => handleCheck('group r')}  type="checkbox"/> 
                <label>ラ</label>
            </div>
            <div>
                <input checked={setCheck('group s')} onChange={() => handleCheck('group s')}  type="checkbox"/> 
                <label>サ</label>
            </div>
            <div>
                <input checked={setCheck('group y')} onChange={() => handleCheck('group y')}  type="checkbox"/> 
                <label>ヤ</label>
            </div>
            <div>
                <input checked={setCheck('group w')} onChange={() => handleCheck('group w')}  type="checkbox"/> 
                <label>ワ</label>
            </div>
            <div>
                <input checked={setCheck('group g')} onChange={() => handleCheck('group g')}  type="checkbox"/> 
                <label>ガ</label>
            </div>
            <div>
                <input checked={setCheck('group b')} onChange={() => handleCheck('group b')}  type="checkbox"/> 
                <label>バ</label>
            </div>
            <div>
                <input checked={setCheck('group d')} onChange={() => handleCheck('group d')}  type="checkbox"/> 
                <label>ダ</label>
            </div>
            <div>
                <input checked={setCheck('group z')} onChange={() => handleCheck('group z')}  type="checkbox"/> 
                <label>ザ</label>
            </div>
            <div>
                <input checked={setCheck('group p')} onChange={() => handleCheck('group p')}  type="checkbox"/> 
                <label>パ</label>
            </div>
            <div>
                <input checked={setCheck('only n')} onChange={() => handleCheck('only n')}  type="checkbox"/> 
                <label>ン</label>
            </div>
        </>
    )
}