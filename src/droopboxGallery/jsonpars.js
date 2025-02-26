const ACCESS_TOKEN = "тsl.u.AFhWVA_3O8klLxBh-acxY5JtFfzRq5yZ9JSVwuiEnxRQVWfpWxZl3PB--mIOH1SkwpwGUKwW-lO5xPkC5QqPw8mseKgJ2Y-gRsefcpMkYDvQLusi9LpB868XPfpFL7JcKtlYXXgcAu_oehq6oQsbonG3GyJBeA6uWgMIegShoIdA3q_9jfMexXJKK_hW4uQkclVGkjjkYyFX6d6oVzxqfrUrZGWAzv_dqMye7fCEWwbW-ZTX-t1_GIgRfFgOPpeNspUCSZHLLDsx4YKlLfRUsRRxsJtysBkQm1yjT5G0_OaVSwtF68JUeuiSDV4SK8H134DMfhPih1QPv_cQZM8jTp7aJNxOKcYueBkyygIUz3yYnlqxN798ugWWCqWbGIYAYV2uZuOSNKigya2KNGsvq6gMmb2DodNngeseb-T8-Ni0lBRr-M9OS5ai39IkD4JF0cb2HIkmyO1VYnxe9SuipS0APUvaGEUCHAgWy9Uyxq5wXxfWivXUafLfVvmyx8IP4z537-GNHgPo9AqXkDXVDKCtPaUdB3g60Zp3URybziNxHySHc1IjljVK-Xltsmz_z-F8TR02dOw1eKhzJw_zQ5GlK1jEMM8JeUekD58vj2t9vvWtE8duKt878rm0mqUwArQs3Pe6uhKMKHonGWmPx1VTQW0Gp2YtNaukBK4P_eScd6TSkxuCMqC2KB9voNvYAmRX8V7dTpr-EC1Z1sGp39ZdKssIav_3eT7L5v4W12_Y2HTes3PNHeMI0o_xw9U5VK1e-UyVmzGnqeDzU3qWmVBe-65HbSnawDWp3oJE3L_DoqnjS6DfChoABRehzlW4p7cGkGwKJ_YLS-lrMzZ0joNAYM82HoBivw8Wblb8wzWEezMC8_dKu7vQ2N3cVMPYXsBoj76pKrpGfIGGJKr-ouNJ50Huo5QlfpqOlaJlBOF4O8Xn8fMvGgov6POVDZq0UmQRY8iPlH69GVTEXaFDFefKFKsmHmfSUcPby9G8_O0AzZeLdzEc0Oz2oDOc-F3ZWpNaTiok87Qk8hCYo1mrrsKhyi4xVh3vuEfi6Vu0dZ8FsWKrMH2dbLl3rFn2uvYXItukNNh0oRuktCfCUPExHIfgweiruNodhX7fuPW6e_tllZArOacWUK9RYqzFMKncKF2ddFTVZo5pu0t4aPINdH4bNpmNoHOa-6lPw6coRMXZT77Wk0AJrfL_kqh-RA2XwOppbhQOt-nwiobiK43omCGcNp041BBEZygwrLDFoNtyjjTHH_Y6jha3wRWJaIB1Dpe5MksH-dHyxZ-_qZZ3z-4Jzu-QvdMoS1s0q7kDI6EWfQ"; // Вставь сюда свой Access Token
const FOLDER_PATH = ""; // Оставь пустым, если используешь "App Folder", или укажи путь

const fetchImages = async () => {
  try {
    const response = await fetch("https://www.dropbox.com/scl/fo/bj84q53qfsprzxdfglm38/AMRHUsGNR6nSVekzRAXgQLc?rlkey=rj7rfsbgu8xdso7fw0l2rx8v0&st=82fplvfj&dl=0", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ path: FOLDER_PATH }) // 
    });

    const data = await response.json();
    console.log(data); // Тут будет JSON со списком файлов

    // Извлекаем ссылки на файлы
    const imageUrls = data.entries
      .filter(file => file[".tag"] === "file") // Оставляем только файлы (без папок)
      .map(file => `https://www.dropbox.com/home${file.path_lower}?raw=1`);

    return imageUrls;
  } catch (error) {
    console.error("Ошибка при получении списка файлов:", error);
    return [];
  }
};
