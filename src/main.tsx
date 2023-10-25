import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from './routes/Root/Root';
import MainPage from './routes/MainPage/MainPage';
import Review from './routes/Review/Review';
import MainHiragana from './routes/Review/Hiragana/MainHiragana/MainHiragana';
import MainKatakana from './routes/Review/Katakana/MainKatakana/MainKatakana';
import MainKanji from './routes/Review/Kanji/MainKanji/MainKanji';
import PronunciaHiragana from './routes/Review/Hiragana/Pronuncia/Pronuncia';
import EscritaHiragana from './routes/Review/Hiragana/Escrita/Escrita';
import EscritaKatakana from './routes/Review/Katakana/Escrita/Escrita';
import PronunciaKatakana from './routes/Review/Katakana/Pronuncia/Pronuncia';
import PronunciaKanji from './routes/Review/Kanji/Pronuncia/Pronuncia';
import SignificadoKanji from './routes/Review/Kanji/Significado/Significado';
import EscritaKanji from './routes/Review/Kanji/Escrita/Escrita';

const router = createBrowserRouter([
  {
    path: "/", element: <Root/>,
    children: [
      {
        path: "/", element: <MainPage />,
      },
      {
        path: "review", element: <Review />,
        children: [
          {path: "hiragana", element: <MainHiragana></MainHiragana>},
          {path: "hiragana/pronuncia", element: <PronunciaHiragana></PronunciaHiragana>},
          {path: "hiragana/escrita", element: <EscritaHiragana></EscritaHiragana>},

          {path: "katakana", element: <MainKatakana></MainKatakana>},
          {path: "katakana/pronuncia", element: <PronunciaKatakana></PronunciaKatakana>},
          {path: "katakana/escrita", element: <EscritaKatakana></EscritaKatakana>},

          {path: "kanji", element: <MainKanji></MainKanji>},
          {path: "kanji/pronuncia", element: <PronunciaKanji></PronunciaKanji>},
          {path: "kanji/escrita", element: <EscritaKanji></EscritaKanji>},
          {path: "kanji/significado", element: <SignificadoKanji></SignificadoKanji>},
        ]
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
