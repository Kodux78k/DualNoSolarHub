Plano de Estudo e Arquitetura: Sinfonia Harmônica KOBLLUX

Este plano integra a metodologia de síntese sonora baseada nos arquétipos simbólicos da Infodose com tecnologias web (Web Audio API) para criar uma experiência sonora generativa, harmônica e pessoal.

---

1. TRINDADE KOBLLUX (Moduladores Principais)

| Arquétipo | Função | Tipo de Módulo | Parâmetro de Controle |
|-----------|--------|------------------|------------------------|
| KODUX     | Ação  | LFO 6Hz (Sawtooth) | Ressonância/Q          |
| BLLUE     | Espaço | Reverb Profundo   | Ganho/Send para Reverb |
| KOBLLUX   | Harmonia | Pitch Control Global | Detune (precisão tonal) |

Esses três moduladores são utilizados para alterar em tempo real os sons das funções da interface.

---

2. ESTRUTURA DE FUNÇÃO (Módulos de Botões)

Cada botão é um patch de síntese, com base na metodologia Schaeffer/Wishart:

| Componente | API (Web Audio) | Exemplo (Botão "Café") |
|------------|------------------|--------------------------|
| Fonte      | OscillatorNode   | onda quadrada            |
| Envelope   | GainNode com ADSR | ataque curto (N')        |
| Massa      | BiquadFilterNode | Low-pass 440Hz           |
| Trama      | Delay/ConvolverNode | reverb opcional         |

---

3. MODULAÇÃO ENTRE MÓDULOS

Exemplo: KODUX modula o botão "Café"

```javascript
const kodux_lfo = audioContext.createOscillator();
kodux_lfo.type = 'sawtooth';
kodux_lfo.frequency.setValueAtTime(6, audioContext.currentTime);

const kodux_gain = audioContext.createGain();
kodux_gain.gain.setValueAtTime(10, audioContext.currentTime);

kodux_lfo.connect(kodux_gain);
kodux_gain.connect(filtroCafe.Q);

kodux_lfo.start();
```

---

4. AFINAÇÃO DO MUNDO VIRTUAL (Lucas Meneguette)

| Arquétipo | Escala | Frequência Base | Efeito |
|-----------|--------|------------------|--------|
| KOBLLUX   | Diatônica ou Pentatônica | 432Hz   | Harmonia total |
| KODUX     | Lídia / Tons inteiros | 440Hz   | Tensão e energia |
| BLLUE     | Microtonal / Graves | 220Hz   | Espaço, profundidade |

A afinação define a tonalidade global da sinfonia gerada.

---

5. MÉTRICAS DO DISPOSITIVO PARA MODULAÇÃO

| Métrica | API | Parâmetro de Som |
|---------|-----|-------------------|
| Brilho  | screen.brightness / sensor | Filtro LPF (frequência de corte) |
| Latência | navigator.connection.rtt | Delay/Reverb                    |
| Bateria | navigator.getBattery()    | Pitch (fundamental)             |

---

6. PERSISTÊNCIA LOCAL: IndexedDB

Cada som e interação é salvo como preset:

```json
{
  "cafe_arch": "KODUX",
  "osc_type": "square",
  "attack": 0.05,
  "cutoff_freq": 440
}
```

Estes presets podem ser restaurados em outra sessão sem necessidade de internet.

---

7. PRÓXIMOS PASSOS

* Escolher o segundo Módulo de Função para integrar (ex: Home, Busca, Mensagem).
* Iniciar prototipagem dos patches usando Web Audio API.
* Criar visualizador interativo da "Sinfonia Harmônica" em tempo real.
* Exportar presets para IndexedDB e testar persistência local.

---

Esse documento resume toda a infraestrutura teórica e técnica para dar vida à sua metodologia de forma científica, funcional e artística.

