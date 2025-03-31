import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";

const origin =
  process.env.NODE_ENV === "production" ? "https://example.com" : "*";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin,
  });
  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  await app.listen(8080);
}

bootstrap();
