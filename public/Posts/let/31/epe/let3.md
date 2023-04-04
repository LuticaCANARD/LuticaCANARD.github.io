전력공학 5주차 강의
*^*MET*^*
# 3상 평형을 대치하는 방법
## Y결선
- 결선이 Y자로 되어있음.
- 중앙은 **중성점**이라 함.
### 중성점의 접지
- 중성점에 N이 붙은 경우 접지, 그렇지 않은 경우 비접지.
- 접지를 했다는 것은, 땅도 도체로 쓰겠다는 것이다.
- 즉, 접지식은 **3상 4선식**을 의미한다.
### 선전류/상전압
- 선간전압...
$$V_{ab} = V_{an}-V_{bn} = V\phase{0\degree} - V\phase{120\degree} = \sqrt{3}V\phase{30\degree}$$...
$$V_{bc} = V_{bn}-V_{cn} = V\phase{120\degree} - V\phase{240\degree} = \sqrt{3}V\phase{-90\degree}$$...
$$V_{ca} = V_{cn}-V_{an} = V\phase{240\degree} - V\phase{0\degree} = \sqrt{3}V\phase{150\degree}$$...
-**전압**임에 유의하자.

## delta 결선

### 선전류/상전압
- 선간전압 = 상전압
- 여기는 전류가 같다.

|결선|V|I|
|----|--|--|
|Y|Vl = root3 Vp|Il = Ip|
|delta| Vl=Vp | Il = root3Ip|

- 그림의 전류/전원에 현혹되지 말자.

# 3상 전력
$$ V = \sqrt{2}V_p\sin{\omega t}$$
인 3상 평형의 상전압...     
3상 전력을 생각해보자.  
$$I = \sqrt{2}I_p \sin{(\omega t-\theta)}$$
라면....    
> 전압및 전류는 3상 평형이다.       
> 전류는 세타만큼 **지상이다**라고 말할 수 있다.    
$$S = V_a I_a^\star +  V_b I_b^\star+ V_c I_c^\star$$
이는,
$$S = 3V_p I_p \cos\theta + j3V_pI_p\sin\theta$$
- 이를 선전압, 선전류로 바꿔보자.

## Y결선,delta 결선의 선전압/선전류
- V_l = 선전압, I_l = 선전류
$$P = 3\times\frac{V_l}{\sqrt{3}}I_l\cos\theta = \sqrt{3}V_lI_l\cos\theta\\Q = \sqrt{3}V_lI_l\sin\theta$$

## 3상전력에서의 중요사항!
- 3상 시스템에서 특별한 언급이 없다면....
- **선간 전압, 선전류**를 의미한다. 
- 상전류와 상전압은 따로있음.

# 단위법 (PU : power unit)
- 단위법에서는 100%가 되는 량을 정한다.
- 전기회로에서 따지는 양은 4가지이다.
- 전압V, 전류I, 임피던스Z, 전력S
- 4개에 대해 100%로 정의되는 량을 정의한다.
- 4가지중 2가지를 임의선택하면.... 2가지는 정해진다.