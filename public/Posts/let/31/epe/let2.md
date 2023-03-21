전력공학 3주차 강의
*^*MET*^*
# Remind
## Impidence
$$ \Z = R + jX $$

- X : 리액턴스(reactance)

$$ Y = \Z = G + jB $$

- B : 서셉턴스(susceptance)

## 페이저의 계산 정리
- HOW TO TRANSFORM IMAGE NUMBER TO PHASE
$$ \frac{\alpha}{B+jC} => \alpha \phase{\tan^-1{\frac{C}{B}}} $$

- FROM image number TO real >
$$ \alpha \phase{\beta} = \alpha [\text{what}(\omega t+\beta)] $$

# 소자의 종류
- 전력을 구할때, 전력의 방향을 찾을때 사용한다.
$$ P = VI $$

## 수동소자
- 순방향이다. (+ to -)
- 전류의 방향과 일치하다
> 수동소자에서 구한 전력은 **소비된 전력을 의미한다.**

## 능동소자
- 역방향이다. (- to +)
- 만들어내는 Energy 
> 능동소자에서 구한 전력은 **생산된 전력을 의미한다.**

# 삼각함수에 관한 공식들...
$$\sin{\alpha+\beta} =\sin{\alpha}\cos{\beta} + \sin{\beta}\cos{\alpha} $$
$$\cos{\alpha+\beta} =\sin{\alpha}\cos{\beta} - \sin{\beta}\cos{\alpha} $$

# 전력의 구성
## 전력
$$ S = P + jQ $$

- S : 피상전력 (VA)
- P : 유효전력 (실제로 일한다.)
- Q : 무효전력

### 피상전력
$$  $$

### 유효전력
$$ P = \frac{V_mI_m}{2}\cos\theta = \frac{V_m}{\sqrt{2}}\frac{I_m}{\sqrt{2}}\cos\theta = V_{RMS}I_{RMS}\cos\theta$$

- 실수성분이다.
- W(와트)

### 무효전력
$$ Q = \frac{V_mI_m}{2}\sin\theta$$

- VAR 

### 주지해야 할 것.
- 전력의 크기를 무조건! RMS값으로 표기한다.
$$S = VI^\star$$

- 복소저항
- I* => 켤레복소수. (conjugation)
#### 켤레복소수의 페이저표현
$$ \phase{\theta}^\star => \phase{-\theta} $$

# 복소전력...
## 저항 R
$$ RI_{\text{RMS}}^2\phase{0\degree} $$

> 저항 R에서는 유효전력 P만 소모된다.

## 인덕터 L
$$ j \omega L \times (I_{m}\phase{\theta})^2  $$
$$ = \omega L I_{m}^2\phase{90\degree} $$
$$ \therefore \omega L I_{m}^2 $$

> 인덕터 L에서는 유효전력이 0이 소모되고,       
> 무효전력 **L * Im^2**가 소모된다.     
> (전압은 전류보다 90도 앞서간다. 지상부하)

## 커패시터 C
$$ -j\frac{1}{\omega C} \times (I_m\phase{\theta})^2 $$
$$ = \frac{1}{\omega C} I_m^2 \phase{-90\degree}$$
$$ \therefore -\frac{1}{\omega C} (I_m)^2 $$

> 인덕터 L에서는 유효전력이 0이 소모되고,       
> 무효전력 **1/(wc) * Im^2**가 생산된다.    
> (전압은 전류보다 90도 뒤쳐진다. 진상부하)

# 역률
- Power Factor > P.F
- 전류의 위상각과 전압의 위상각의 차이. 
- **전류가** 전압보다 앞서면 "**진상**역률", 전류가 전압보다 뒤지면 "**지상**역률"이라고 한다.
- 진상부하 / 지상부하.
$$P.F = \cos(PFD)$$