# VRC with Web
## 개요 

- VRC는 Web과의 연결을 크게 제한해온 바가 있었습니다. 
- 하지만 2023년 4월경의 업데이트로, 웹에서 문자열을 그대로 불러와 사용가능하게 하는 업데이트가 가능하였습니다.
- 이로서 VRC는 유저가 조작가능한 Web 컨트롤러를 확보함으로서, 더 넓은 가능성을 확보하게 되었습니;다.
- 그러함에도, 아무래도 업데이트에 대한 자료가 부족하고 어려운 감이 있어서, 이곳에 정리하려합니다.
- 이 글을 보시는 모든분들이 상상력에 제한없이 월드를 구축하셨으면 좋겠습니다. 

## 면책사항
- 2023년 10월 22일의 저는 대학생이자 초보개발자로서, 이 문서에서 미숙한 면이 있을 수 있습니다. 이점을 양해해주시고, 읽으시다가 지적하고싶으신게 있으시다면 이슈혹은 덧글로 코멘트 부탁드립니다.

## 참고영상
<iframe src="https://www.youtube.com/embed/dAVi2ns0YEA?si=_URbOOXHbcZO6swx&t=5631" title="제 4회 한국 월드 제작자 심포지움" frameborder="0" allow=" accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" style="width:100%;height:500px; " allowfullscreen></iframe>

- 2023 10 21 한국 월드 제작자 심포지움 발표 
## Web이란 무엇인가? 
- 웹은 나날이 변화하는 분야로서, 말하는 맥락에 따라서 정의가 가능합니다. 
- 따라서 이 문서에서는, 보통 말하는 웹과 제가 말하려는 웹을 따로 서술하여 의도를 명확히 하도록 하겠습니다.

### 광의의 Web
- 광의의 웹은 **인터넷에 연결된 사용자들이 서로의 정보를 공유할 수 있는 공간**을 의미합니다. ([출처](https://www.tcpschool.com/webbasic/www))
- 이러한 관점에서, 모두에게 제한없이 정보를 전달하고자 하는 [웹접근성](https://www.w3.org/WAI/fundamentals/accessibility-intro/ko)등이 설명될 수 있습니다.

### 협의의 Web
- 여기서 말하려는 Web이란, **HTTP 프로토콜을 통하여 서로간의 API를 통해 원하는 정보를 공유하는 방법**을 의미합니다. ([출처](https://developer.mozilla.org/ko/docs/Glossary/World_Wide_Web))
- 이러한 관점에서, Web Application과 RestfulAPI를 설명할 수 있습니다. 

## Web와 VRC의 가능성.

### Vket2023 Summer의 가능성
- [**VCAP**](https://x.com/VCApi_Proj) 의 경우, Message 기믹과 Qv펜 보존 기믹을 통하여 Web통신을 통한 인스턴스간 통신과 데이터의 보존 가능성을 보여주었습니다.
- [**YAIBA**](https://note.com/cocu_tan/n/n70972d7646bd)의 경우, Vket 동선 추적을 통한 빅데이터 기반의 월드제작 가능성을 보여주었습니다.

### 그 외
- [**CBS**](https://x.com/CBS_VRC)의 경우, Udon Chips와 WebApi를 접목 가능함을 보여주었습니다.

## 알아둬야하는 기반지식
### 웹은 무엇으로 이루어져있는가?
- 웹이란, 서버-클라이언트 모델을 따르는 패턴으로 구성되어있습니다.
#### Client
- Request를 보내는 존재입니다. 
- 식당에서 요리를 주문하는 고객이라고 생각하시면 편하실 것 같습니다. 
- 보통의 웹에서는 웹 브라우저가 이 역할을 수행하지만, vrchat에서는 unity가 이 역할을 수행한다고 할 수 있습니다.
#### Server
- Request에 따라서 Response를 응답해주는 존재입니다. 
- 
#### DataBase
- 데이터를 보존하는 Base
- 데이터 중심인 현대사회에서의 인프라.
- 표 방식인 SQL과 표 이외의 방식인 NoSQL로 구분됩니다.
### HTTP?
- Http란, 두 컴퓨터간의 소통에 있어서 가장 추상화된 연결규약 중 하나(OSI 7계층)입니다.
- 

#### HTTPS?
- HTTPS란, 통신내용이 탈취되지않게 암호화된 통신으로 연결된 HTTP연결을 의미합니다.

#### PROXY?
- 프록시란, 서버가 직접 클라이언트랑 맞닿지않고 간접적으로 HTTP통신을 연결해주는 중간체입니다.
- DDOS공격을 막거나, 접속의 부하를 경감시켜줄 수 있게 해줍니다.
> side : CloudFlare, AWS ALB, nginX등이 해당합니다.

### JSON?
- 웹에서 사용되는 경량의 데이터 상호교환규격입니다.
- JSON아래에 들어올 수 있는 Type는 아래와 같습니다.

#### Object
- Key-Value pair를 통하여 데이터를 접근 가능하게 하는 자료형입니다.

#### Array
- 열거(enumeration)형식으로 구현된 요소.
- array속 요소의 형태가 무조건 정해진 C#과는 달리, **각각의 요소가 다른 type일 수 있음을 유의할 필요가 있습니다.**
- 

#### primitive
- String, Number, Null, Boolean등의 [원시적 데이터 타입](https://developer.mozilla.org/ko/docs/Glossary/Primitive)

### header?
- HTTP Request/Response 를 요약해주는 하나의 요소.

## Consumer 입장에서의 사용방법
- 이 장은 **VRC월드 개발자**를 위하여 작성되었습니다.

### Unity상에서의 구현 원리와 그 특징
- Header를 보면, **UnityWebRequest**를 통하여 보내게 되어있습니다.
- 이는, vrc 서버를 경유하지 않고 유저 각자의 클라이언트가 웹 브라우저처럼 작용하여 request를 보냄을 시사합니다.

#### 간단한 사용예제
```cs

void Start()
{

}
public override void OnStringLoadSuccess()
{

}
public override void OnStringLoadError()
{

}

```
#### VRCUrl의 특징

#### UnityWebRequest의 특징
- 코루틴 형식으로 처리되는 관계로, 딜레이가 있을 수 있음을 알아두셔야합니다.
- 예상가능한 딜레이로서는,`request 전송시간 + 서버 처리시간 + response 전송시간 + u#처리시간` 정도가 소요됩니다. 
- 코루틴에 의해 점유되는 loop circle은 미미하다고 할 수 있습니다. 
- 데이터 용량에 따라서,response의 전송시간이 달라질 수 있습니다. 때문에, 이미지에 비해서 용량이 적은 string은 딜레이가 덜 걸립니다. 


### Loader계의 종류와 특징
#### String Loader
- 결과가 (사람이 읽을수 있는 포맷의) 문자열로 기대되는 경우 시용합니다.
- 정적 class의 메소드 함수를 호출해 

#### Image Loader
- 결과가 2DTexture 로 기대되는 경우.

### JSON 데이터의 U#에서의 분해와 해석
- 이경우, VRCJson 정적class에 있는 `TryDeserillizeJson (String, Datatoken)`을 통하여 string으로 되어있는 json데이터를 u#에서 다룰 수 있게 역직렬화 할 수 있습니다.

 


## Producer 입장에서의 요구사항
- 이 장은 **서버개발자**를 위하여 작성되었습니다.
- 

### 어떤 서버를 갖춰야하는가?
- HTTP/1.1을 기반으로 하는 서버여야합니다. 
> (HTTP/2.0으로 응답하는지 잘 모르겠습니다. 또한 그 이점도 잘 안 느껴질 것이라 생각되구요.)
- Creator가 모든유저에게 접근가능성를 원한다면, Trusted Url를 사용하는 서버를 구축하여야 합니다. 아래 방법을 권장합니다.
> Github CI/CD + Docker 를 통한 정적 서버 구축
> pastebin을 통한 

### 서버입장에서는 어떤 주의를 갖추어야하는가?

- single web application server를 구축가능하시다면, 보통 문제는 없으실 것입니다.

### Response를 만들때 주의할 사항


## 마치면서 : Loader를 둘러싼 이슈

### IP및 정보수집의 법률적 문제


