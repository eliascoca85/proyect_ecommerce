"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaTiktok, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope,
  FaCreditCard,
  FaLock 
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black relative">
      {/* Elemento decorativo superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
      
      {/* Contenido principal del footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Columna 1 - Logo y descripción */}
          <div className="space-y-4">
            <div className="relative h-12 w-40 mb-4">
              <span className="font-ka1 text-white">Los miserables</span>
            </div>
            <p className="text-gray-400 text-sm">
              Somos una tienda especializada en hardware y equipos gaming, ofreciendo los mejores productos con garantía oficial y excelente servicio post-venta.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                <FaYoutube size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                <FaTiktok size={20} />
              </a>
            </div>
          </div>
          
          {/* Columna 2 - Enlaces rápidos */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-red-500 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/productos" className="text-gray-400 hover:text-red-500 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-gray-400 hover:text-red-500 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/soporte" className="text-gray-400 hover:text-red-500 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  Soporte técnico
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-red-500 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-gray-400 hover:text-red-500 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  Acerca de nosotros
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Columna 3 - Contacto */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                <span>Av. Tecnológica 123, Ciudad Digital, CP 28000</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaPhoneAlt className="text-red-500 flex-shrink-0" />
                <span>+34 900 123 456</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaEnvelope className="text-red-500 flex-shrink-0" />
                <span>contacto@tudominio.com</span>
              </li>
            </ul>
            
            {/* Horario */}
            <div className="mt-4">
              <h4 className="text-white text-sm font-semibold mb-2">Horario de atención</h4>
              <p className="text-gray-400 text-sm">
                Lun - Vie: 9:00 - 20:00<br />
                Sábados: 10:00 - 14:00
              </p>
            </div>
          </div>
          
          {/* Columna 4 - Newsletter y métodos de pago */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Suscríbete</h3>
            <p className="text-gray-400 text-sm mb-3">
              Recibe nuestras ofertas y novedades en tu email.
            </p>
            <form className="mb-4">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Tu email" 
                  className="px-4 py-2 flex-1 bg-gray-800 border border-gray-700 focus:border-red-500 rounded-l-lg focus:outline-none text-white text-sm"
                />
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 transition-colors duration-300 rounded-r-lg text-white text-sm"
                >
                  Enviar
                </button>
              </div>
            </form>
            
            {/* Métodos de pago */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Métodos de pago</h4>
              <div className="flex items-center space-x-3 mt-2">
                <div className="bg-gray-800 p-2 rounded-md">
                  <FaCreditCard className="text-gray-400" size={18} />
                </div>
                <div className="relative h-6 w-12">
                  <Image 
                    src="/logos/visa.png" 
                    alt="Visa" 
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className="relative h-6 w-12">
                  <Image 
                    src="/logos/mastercard.png" 
                    alt="MasterCard" 
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className="relative h-6 w-12">
                  <Image 
                    src="/logos/stripe.png" 
                    alt="PayPal" 
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
              <div className="flex items-center mt-3 text-gray-400 text-xs">
                <FaLock className="text-red-500 mr-2" size={12} />
                <span>Pagos 100% seguros</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom footer con derechos y políticas */}
      <div className="bg-gray-900/50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-xs mb-3 md:mb-0">
              © {currentYear} Los Miserables. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4">
              <Link href="/privacidad" className="text-gray-500 hover:text-red-500 transition-colors duration-300 text-xs">
                Política de Privacidad
              </Link>
              <Link href="/terminos" className="text-gray-500 hover:text-red-500 transition-colors duration-300 text-xs">
                Términos de Uso
              </Link>
              <Link href="/cookies" className="text-gray-500 hover:text-red-500 transition-colors duration-300 text-xs">
                Cookies
              </Link>
              <Link href="/legal" className="text-gray-500 hover:text-red-500 transition-colors duration-300 text-xs">
                Aviso Legal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;