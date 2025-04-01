"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaDiscord, FaGamepad, FaCheckCircle, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre_completo: '',
    correo: '',
    clave: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsSubscription, setNewsSubscription] = useState(true);
  
  // Estados para el proceso de registro
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Validación de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setError('Por favor, ingresa un correo electrónico válido');
      return false;
    }

    // Validación de contraseña
    if (formData.clave.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    // Confirmar contraseña
    if (formData.clave !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    // Términos y condiciones
    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validar el formulario
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_completo: formData.nombre_completo,
          correo: formData.correo,
          clave: formData.clave,
          rol: 'Cliente', // Asignamos rol de Cliente siempre
          newsSubscription // Opcional, si quieres guardar también esta preferencia
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
      }

      // Registro exitoso
      setSuccess('¡Cuenta creada correctamente! Redirigiendo al login...');
      
      // Limpiar formulario
      setFormData({
        nombre_completo: '',
        correo: '',
        clave: '',
        confirmPassword: ''
      });
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Error en el registro:', err);
      setError(err.message || 'Ha ocurrido un error durante el registro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-contm">
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-30 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white py-2 px-4 rounded-lg border border-gray-800 hover:border-red-500 transition-colors duration-300 group"
      >
        <FaArrowLeft className="text-red-500 group-hover:transform group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Volver al inicio</span>
      </Link>
      
      {/* Lado izquierdo - Formulario */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-black order-2 md:order-1">
        <div className="w-full max-w-md">

          <div className="flex justify-center md:hidden mb-8">
            <div className="relative w-32 h-14">
              <Image
                src="/img/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>


          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              <span className="text-red-500">Crear</span> Cuenta
            </h1>
            <p className="text-gray-400 mt-2">
              Únete a nuestra comunidad de gamers y disfruta de beneficios exclusivos
            </p>
          </div>

          {/* Mensajes de error o éxito */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-600 rounded-lg text-white flex items-start gap-2">
              <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-600 rounded-lg text-white flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
              <p>{success}</p>
            </div>
          )}

          <div className="relative bg-gray-900/60 p-8 rounded-xl border border-gray-800">

            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/20 via-red-500/10 to-transparent rounded-xl blur-sm"></div>
            

            <form onSubmit={handleSubmit} className="relative z-10 space-y-5">

              <div className="space-y-2">
                <label htmlFor="nombre_completo" className="block text-sm font-medium text-gray-400">
                  Nombre completo
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaUser className="text-gray-500" />
                  </div>
                  <input
                    id="nombre_completo"
                    name="nombre_completo"
                    type="text"
                    value={formData.nombre_completo}
                    onChange={handleChange}
                    className="pl-10 w-full py-3 bg-gray-800/70 text-white placeholder-gray-500 rounded-lg border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors duration-200"
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
              </div>


              <div className="space-y-2">
                <label htmlFor="correo" className="block text-sm font-medium text-gray-400">
                  Correo electrónico
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaEnvelope className="text-gray-500" />
                  </div>
                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    value={formData.correo}
                    onChange={handleChange}
                    className="pl-10 w-full py-3 bg-gray-800/70 text-white placeholder-gray-500 rounded-lg border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors duration-200"
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </div>
              </div>


              <div className="space-y-2">
                <label htmlFor="clave" className="block text-sm font-medium text-gray-400">
                  Contraseña
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    id="clave"
                    name="clave"
                    type={showPassword ? "text" : "password"}
                    value={formData.clave}
                    onChange={handleChange}
                    className="pl-10 w-full py-3 bg-gray-800/70 text-white placeholder-gray-500 rounded-lg border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors duration-200"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números
                </p>
              </div>


              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400">
                  Confirmar contraseña
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 w-full py-3 bg-gray-800/70 text-white placeholder-gray-500 rounded-lg border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors duration-200"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>


              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={() => setAcceptTerms(!acceptTerms)}
                    required
                    className="w-4 h-4 accent-red-500 rounded focus:ring-red-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-400">
                    Acepto los <Link href="/terminos" className="text-red-500 hover:underline">términos y condiciones</Link> y la <Link href="/privacidad" className="text-red-500 hover:underline">política de privacidad</Link>
                  </label>
                </div>
              </div>


              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newsletter"
                    type="checkbox"
                    checked={newsSubscription}
                    onChange={() => setNewsSubscription(!newsSubscription)}
                    className="w-4 h-4 accent-red-500 rounded focus:ring-red-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="newsletter" className="text-gray-400">
                    Quiero recibir ofertas exclusivas, noticias y actualizaciones por correo electrónico
                  </label>
                </div>
              </div>


              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30 flex items-center justify-center gap-2 mt-6 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <span className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <FaGamepad />
                    <span>Crear cuenta</span>
                  </>
                )}
              </button>


              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-700"></div>
                <span className="px-4 text-sm text-gray-500">O regístrate con</span>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>


              <div className="grid grid-cols-3 gap-3">
                <button 
                  type="button"
                  className="flex items-center justify-center py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-colors duration-200"
                >
                  <FaGoogle className="text-white/80" />
                </button>
                <button 
                  type="button"
                  className="flex items-center justify-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border border-blue-700 transition-colors duration-200"
                >
                  <FaFacebook className="text-white/80" />
                </button>
                <button 
                  type="button"
                  className="flex items-center justify-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg border border-indigo-700 transition-colors duration-200"
                >
                  <FaDiscord className="text-white/80" />
                </button>
              </div>
            </form>
          </div>


          <p className="text-center mt-8 text-gray-400">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-red-500 hover:text-red-400 font-medium">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>

      {/* Lado derecho - Imagen y beneficios */}
      <div className="hidden md:flex md:w-1/2 bg-gray-900 relative order-1 md:order-2">
        <Image 
          src="/img/login-bg.jpg" 
          alt="Gaming Equipment" 
          fill
          className="object-cover opacity-70"
        />
        

        <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-black/50 z-10"></div>
        
        
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center p-12">
          <div className="bg-black/50 backdrop-blur-sm p-8 rounded-2xl max-w-lg border border-gray-800">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Beneficios de <span className="text-red-500">Unirse</span>
            </h2>
            
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <FaCheckCircle className="text-red-500" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Ofertas Exclusivas</h4>
                  <p className="text-gray-400 text-sm">Acceso anticipado a descuentos y promociones especiales solo para miembros.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <FaCheckCircle className="text-red-500" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Seguimiento de Pedidos</h4>
                  <p className="text-gray-400 text-sm">Visualiza el historial y estado de tus pedidos en tiempo real.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <FaCheckCircle className="text-red-500" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Programa de Recompensas</h4>
                  <p className="text-gray-400 text-sm">Gana puntos por cada compra que podrás canjear por descuentos.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <FaCheckCircle className="text-red-500" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Soporte Prioritario</h4>
                  <p className="text-gray-400 text-sm">Atención preferencial para cualquier consulta o problema técnico.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}