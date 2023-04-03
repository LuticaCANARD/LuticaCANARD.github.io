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
1. Block : system (TF).. 곱하기
2. Arrow(Line) : signal
3. Summing Junction : 계산 > 원형으로 되어있음.
4. Pickoff Point : R(s)가 모든 포인트로 동일하게 나감. 

### Cascade (종속형)
- G1 G2 G3가 LINE로 되어있는데, 이를 줄이고 싶음.
- 입력은 U(s)
- U(s) * G1 * G2 * G3 로 줄일 수 있다.
### Parallel(병렬)
- G1, G2, G3가 모두 병렬이고, 최후에는 더할 때.
- U(s)가 입력될 떄...
- U(s) * (G1+G2+G3) 으로 줄일 수 있다. 
### Feedback (피드백)
- G(s) , H(s)
- R(s)가 입력, C(s)가 출력
- E(s)를 중간 입력이라 하자...
- E(s) = R(s) - H(s)C(s)
- C(s) = G(s)E(s)
- C(s) = G(s)R(s)-G(s)H(s)C(s)
- (1+G(s)H(s))*C(s) = G(s)R(s)
- 따라서...
$$  \frac{C(s)}{R(s)}= \frac{G(s)}{(1+G(s)H(s))} $$
> 대부분 빼기긴 한데, 더하기인 경우가 있기는 하다.  
> 따라서, 부호도 알아는 두자... 그 경우 +가 -가 된다.

### Block Diagram Algebra
- 단순화에 쓰인다.
1. case1 :
- G(R-X)를 단순화.. > GR-GX가 가능하다.
2. case2 :
- RG-X .... > G(R-X/G)로 변형이 된다.
3. case3 :
- R(s) -> pickoff -> G1(s)
- 다른곳에 1/G1(s) 를 삽입.
4. case4 :
- pickoff 분배가 가능하다.

## Signal flow 신호흐름 선도
- 시간영역의 그림화
- Moson's role로 단순화
### 구성요소
- Line : T/F
- Node : Signal
> Summing Junction, Pickoff는 없다.     
->- : line 
0 : node

