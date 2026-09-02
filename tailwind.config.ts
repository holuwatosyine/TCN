import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'outfit': ['Outfit', 'sans-serif'],
				'dmsans': ['DM Sans', 'sans-serif'],
				'inter': ['Inter', 'sans-serif'],
				'playfair': ['Playfair Display', 'serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					light: 'hsl(var(--primary-light))',
					dark: 'hsl(var(--primary-dark))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				coaching: {
					red: 'hsl(var(--coaching-red))',
					'red-light': 'hsl(var(--coaching-red-light))',
					'red-dark': 'hsl(var(--coaching-red-dark))',
					navy: 'hsl(var(--coaching-navy))',
					'navy-light': 'hsl(var(--coaching-navy-light))',
					'royal-blue': 'hsl(var(--coaching-royal-blue))',
					orange: 'hsl(var(--coaching-orange))',
					'orange-light': 'hsl(var(--coaching-orange-light))',
					gold: 'hsl(var(--coaching-gold))',
					'gold-light': 'hsl(var(--coaching-gold-light))',
					purple: 'hsl(var(--coaching-purple))',
					blue: 'hsl(var(--coaching-blue))',
					green: 'hsl(var(--coaching-green))',
					'green-light': 'hsl(var(--coaching-green-light))',
					gray: 'hsl(var(--coaching-gray))',
					'gray-light': 'hsl(var(--coaching-gray-light))',
					'gray-dark': 'hsl(var(--coaching-gray-dark))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-accent': 'var(--gradient-accent)',
				'gradient-royal': 'var(--gradient-royal)',
				'gradient-nature': 'var(--gradient-nature)',
				'gradient-section': 'var(--gradient-section)',
				'gradient-section-alt': 'var(--gradient-section-alt)',
				'gradient-card': 'var(--gradient-card)',
				'gradient-overlay': 'var(--gradient-overlay)',
				'gradient-glass': 'var(--gradient-glass)'
			},
			boxShadow: {
				'elegant': 'var(--shadow-elegant)',
				'soft': 'var(--shadow-soft)',
				'glow': 'var(--shadow-glow)',
				'glow-red': 'var(--shadow-glow-red)',
				'glow-green': 'var(--shadow-glow-green)',
				'glow-purple': 'var(--shadow-glow-purple)',
				'card': 'var(--shadow-card)',
				'glass': 'var(--shadow-glass)'
			},
			transitionTimingFunction: {
				'smooth': 'var(--transition-smooth)',
				'spring': 'var(--transition-spring)',
				'bounce': 'var(--transition-bounce)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(50px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-in-scale': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.8) translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1) translateY(0)'
					}
				},
				'slide-in-right': {
					'0%': {
						transform: 'translateX(100%) rotateY(30deg)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateX(0) rotateY(0deg)',
						opacity: '1'
					}
				},
				'slide-in-left': {
					'0%': {
						transform: 'translateX(-100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)'
					},
					'50%': {
						transform: 'translateY(-20px) rotate(2deg)'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 30px hsl(var(--coaching-red) / 0.4)',
						transform: 'scale(1)'
					},
					'50%': {
						boxShadow: '0 0 60px hsl(var(--coaching-red) / 0.8)',
						transform: 'scale(1.02)'
					}
				},
				'bounce-in': {
					'0%': {
						transform: 'scale(0.3) translateY(100px)',
						opacity: '0'
					},
					'50%': {
						transform: 'scale(1.05)',
						opacity: '1'
					},
					'70%': { transform: 'scale(0.9)' },
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'gradient-shift': {
					'0%, 100%': { 'background-position': '0% 50%' },
					'50%': { 'background-position': '100% 50%' }
				},
				'text-glow': {
					'0%, 100%': {
						textShadow: '0 0 20px hsl(var(--coaching-gold) / 0.5), 0 0 40px hsl(var(--coaching-gold) / 0.3)',
						transform: 'scale(1)'
					},
					'50%': {
						textShadow: '0 0 30px hsl(var(--coaching-gold) / 0.8), 0 0 60px hsl(var(--coaching-gold) / 0.5)',
						transform: 'scale(1.02)'
					}
				},
				'subtle-float': {
					'0%, 100%': {
						transform: 'translateY(0px) translateX(0px) rotate(0deg)'
					},
					'33%': {
						transform: 'translateY(-10px) translateX(5px) rotate(1deg)'
					},
					'66%': {
						transform: 'translateY(5px) translateX(-5px) rotate(-1deg)'
					}
				},
				'gentle-bounce': {
					'0%, 100%': {
						transform: 'translateY(0px) scale(1)',
						opacity: '1'
					},
					'50%': {
						transform: 'translateY(-5px) scale(1.02)',
						opacity: '0.9'
					}
				},
				'smooth-slide': {
					'0%': {
						transform: 'translateX(-50px) scale(0.8)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateX(0px) scale(1)',
						opacity: '1'
					}
				},
				'premium-glow': {
					'0%, 100%': {
						boxShadow: '0 4px 20px hsl(var(--coaching-gold) / 0.3), 0 0 40px hsl(var(--coaching-gold) / 0.1)',
						transform: 'scale(1)'
					},
					'50%': {
						boxShadow: '0 8px 40px hsl(var(--coaching-gold) / 0.5), 0 0 80px hsl(var(--coaching-gold) / 0.2)',
						transform: 'scale(1.05)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.3s ease-out',
				'accordion-up': 'accordion-up 0.3s ease-out',
				'fade-in-up': 'fade-in-up 0.8s ease-out',
				'fade-in-scale': 'fade-in-scale 0.6s ease-out',
				'slide-in-right': 'slide-in-right 1.2s ease-out',
				'slide-in-left': 'slide-in-left 1s ease-out',
				'float': 'float 4s ease-in-out infinite',
				'float-delayed': 'float 4s ease-in-out infinite 1.5s',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'bounce-in': 'bounce-in 1s ease-out',
				'shimmer': 'shimmer 2s ease-in-out infinite',
				'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
				'text-glow': 'text-glow 4s ease-in-out infinite',
				'subtle-float': 'subtle-float 8s ease-in-out infinite',
				'gentle-bounce': 'gentle-bounce 3s ease-in-out infinite',
				'smooth-slide': 'smooth-slide 0.8s ease-out',
				'premium-glow': 'premium-glow 4s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
