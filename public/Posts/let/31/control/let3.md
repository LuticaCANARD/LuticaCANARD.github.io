제어공학 5주차
*^*MET*^*
# Canonical Form
$$ \begin{matrix} \frac{dx_1}{dt}\\\frac{dx_2}{dt}\\\frac{dx_3}{dt} \end{matrix} = \begin{matrix}0&1&0\\0&0&1\\-9&-6&-3\end{matrix}\begin{matrix}x_1\\x_2\\x_3\end{matrix}+\begin{matrix}0\\0\\+7\end{matrix}u(t) $$
- ON ... state variable.
$$ x_1 = y(t) , x_2=y`(t)...$$
- 분자가 있다면 C매트릭스가 바뀐다.

$$Y(s) = AX`(s) + BU(s) \\ Y(s) = CX (s) + DV(s)$$ 
$$T.F = C(sIA^{-1}B + D)$$
# Block Diagram
- Kalman에 의해 정립 어쩌구
- 제어에 선형대수를 도입해서 어쩌구
- 입력 > system > 출력 
## 블록선도 5.2
- 주파수 영역의 그림화
- Block Diagram Algebra 로 단순화 
1. Block : system (TF)
2. Arrow(Line) : signal
3. Summing Junction : 계산 > 원형으로 되어있음.
4. Pickoff Point : R(s)가 모든 포인트로 동일하게 나감. 
## 신호흐름 선도
- 시간영역의 그림화
- Moson's role로 단순화