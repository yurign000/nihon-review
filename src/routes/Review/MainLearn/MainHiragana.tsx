import { useEffect, useRef } from 'react';
import modo_de_estudo from '../../../assets/modo-de-estudo.png';
import modo_de_estudo_dark from '../../../assets/modo-de-estudo-dark.png';
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import playSound from '../../../scripts/manageSounds';
import RootContext from '../../../scripts/RootContext';

export default function MainHiragana(){
    //ESTADOS OBTIDO DO root.tsx
    const {
        configuration, 
        setChangedURL
    }: RootContext = useOutletContext() 

    const title_img = useRef<HTMLImageElement>(null);

    //VERIFICAR SE MODO DARK ESTÁ ATIVO
    useEffect(() => {
        if(configuration.theme == 'dark'){
            if(title_img.current){
                title_img.current.src = modo_de_estudo_dark
            }
        }
    }, [configuration])

    const nextPage = (): void => {
        setChangedURL(true);
        playSound('change-page');
    }

    return (
        <div className="mainAlphabets flex-center">
                <section className='flex-center'>
                    <figure className='flex-center'>
                        <img ref={title_img} src={modo_de_estudo} alt="titulo - modo de estudo" />
                    </figure>

                    <article className='flex-center'>
                        <div>
                            <Link className='text-hover text-shadow' to='/review/hiragana/pronuncia' onClick={() => nextPage()}>
                                PRONUNCIA
                            </Link>
                        </div>
                        <div>
                            <Link className='text-hover text-shadow' to='/review/hiragana/escrita'onClick={() => nextPage()}>
                                ESCRITA
                            </Link>
                        </div>
                    </article>
                </section>

            <Outlet context={[setChangedURL]}/>
        </div>
    )
}