import {
  Body,
  Head,
  Heading,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

interface VerificationTemplateProps {
  domain: string;
  token: string;
}

export default function VerificationTemplate({
  domain,
  token,
}: VerificationTemplateProps) {
  const verificationLink = `${domain}/account/verify/?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Верификация аккаунта</Preview>
      <Tailwind>
        <Body className="max-w-2xl mx-auto p-6 bg-[#131317]">
          <Section className="text-center mb-8">
            <Heading className="text-3xl text-white font-bold">
              Nova
            </Heading>
            <Text className="text-xl text-white font-bold">
              Потдверждение вашей почты
            </Text>
            <Text className="text-base text-white">
              Спасибо за регистрацию в Nova Video! Что бы подтвердить свой адрес
              электронной почты, пожалуйста, перейдите по следующей ссылке:
            </Text>
            <Link
              href={verificationLink}
              className="inline-flex justify-center items-center rounded-full text-sm font-medium text-white !important bg-[#253ECE] px-5 py-2"
            >
              Подтвердить почту
            </Link>
          </Section>

          <Section className="text-center mt-8">
            <Text className="text-gray-600">
              Если у вас есть вопросы или вы столкнулись с трудностям, не
              стесняйтесь обращаться в нашу службу поддержки по адресу{' '}
              <Link
                href="mailto:nova-service.sup@mail.ru"
                className="text-[#5074d6] underline"
              >
                help@nova
              </Link>
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
