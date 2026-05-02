"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log'],
    });
    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: [process.env.FRONTEND_URL || 'http://localhost:3000', process.env.APP_URL || 'http://localhost:4000'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('MediBook API')
        .setDescription('Doctor Appointment Booking Platform API')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Auth')
        .addTag('Users')
        .addTag('Doctors')
        .addTag('Clinics')
        .addTag('Appointments')
        .addTag('Slots')
        .addTag('Patients')
        .addTag('Prescriptions')
        .addTag('Payments')
        .addTag('Blogs')
        .addTag('Admin')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: { persistAuthorization: true },
    });
    const port = process.env.PORT || 4000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 MediBook Backend running on: http://localhost:${port}`);
    console.log(`📚 API Docs: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map