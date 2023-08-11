import Mailgen from 'mailgen'

export const emailGen = (
  username: string,
  brand: string,
  link: string,
  value: string,
  intro?: string,
  instructions?: string
) => {
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: brand,
      link: 'http://127.0.0.1:3000/',
      logo: 'https://firebasestorage.googleapis.com/v0/b/social-technology.appspot.com/o/logo%2Flogo.png?alt=media&token=016d60da-01e4-4a22-a8aa-3f37e8401889'
    }
  })
  const email = {
    body: {
      name: username,
      intro: intro ? intro : 'Xin vui lòng không chia sẻ mã này cho bất cứ ai!',
      action: {
        instructions: instructions
          ? instructions
          : 'Để tiếp tục khôi phục mật khẩu. Bạn cần nhập mã này vào trang khôi phục mật khẩu',
        button: {
          color: '#9F18F2', // Optional action button color
          text: value,
          link
        }
      },
      outro: 'Mọi ý kiến thắc mắc. Xin vui lòng phản hồi lại email này'
    }
  }
  const emailBody = mailGenerator.generate(email)
  return emailBody
}
