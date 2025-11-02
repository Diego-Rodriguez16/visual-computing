"""
Simulación BCI (EEG sintético y control)
Autor: Juan Diego Velasquez Pinzon / jvelasquezpi@unal.edu.co
Descripción:
    Este programa simula un sistema BCI básico que genera señales EEG sintéticas,
    aplica filtros pasa banda (Alpha y Beta) y controla una interfaz visual
    mediante PyGame, donde el color o movimiento responde a la actividad cerebral.
"""

import numpy as np
import pygame
import matplotlib.pyplot as plt
from scipy.signal import butter, lfilter
import time

# ==================== CONFIGURACIÓN ====================
pygame.init()
WIDTH, HEIGHT = 1200, 700
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Simulación BCI - EEG Sintético")
clock = pygame.time.Clock()

# Parámetros EEG
SAMPLING_FREQ = 250  # Hz
dt = 1 / SAMPLING_FREQ
time_window = np.linspace(0, 1, SAMPLING_FREQ, endpoint=False)

# Colores
BG_COLOR = (15, 15, 25)
TEXT_COLOR = (255, 255, 255)
ALPHA_COLOR = (0, 150, 255)
BETA_COLOR = (255, 60, 60)
BALANCED_COLOR = (255, 215, 0)

# Fuentes
font_title = pygame.font.SysFont("Arial", 32, bold=True)
font_state = pygame.font.SysFont("Arial", 28, bold=True)
font_info = pygame.font.SysFont("Arial", 20)
font_small = pygame.font.SysFont("Arial", 16)

# ==================== FILTROS ====================
def butter_bandpass(lowcut, highcut, fs, order=4):
    """Crea un filtro pasa banda Butterworth"""
    nyq = 0.5 * fs
    low = lowcut / nyq
    high = highcut / nyq
    b, a = butter(order, [low, high], btype='band')
    return b, a

def apply_bandpass_filter(data, lowcut, highcut, fs):
    """Aplica filtro pasa banda a los datos"""
    b, a = butter_bandpass(lowcut, highcut, fs)
    return lfilter(b, a, data)

# ==================== GENERACIÓN DE SEÑAL EEG ====================
class EEGGenerator:
    def __init__(self):
        self.alpha_amp = 1.0
        self.beta_amp = 0.8
        self.noise_level = 0.2
        
    def generate_signal(self, t):
        """Genera señal EEG sintética con componentes alpha, beta y ruido"""
        alpha_component = self.alpha_amp * np.sin(2 * np.pi * 10 * t)
        beta_component = self.beta_amp * np.sin(2 * np.pi * 20 * t)
        noise = self.noise_level * np.random.randn(len(t))
        
        return alpha_component + beta_component + noise
    
    def update_amplitudes(self, mode='normal'):
        """Actualiza amplitudes según el modo de simulación"""
        if mode == 'relaxed':
            self.alpha_amp = min(1.8, self.alpha_amp + 0.05)
            self.beta_amp = max(0.3, self.beta_amp - 0.02)
        elif mode == 'active':
            self.beta_amp = min(1.8, self.beta_amp + 0.05)
            self.alpha_amp = max(0.3, self.alpha_amp - 0.02)
        else:  # normal
            # Variaciones aleatorias pequeñas
            self.alpha_amp += np.random.uniform(-0.01, 0.01)
            self.beta_amp += np.random.uniform(-0.01, 0.01)
            self.alpha_amp = np.clip(self.alpha_amp, 0.5, 1.5)
            self.beta_amp = np.clip(self.beta_amp, 0.5, 1.5)

# ==================== PROCESAMIENTO DE SEÑALES ====================
class SignalProcessor:
    def __init__(self, fs):
        self.fs = fs
        self.alpha_range = (8, 12)
        self.beta_range = (13, 30)
    
    def extract_band_energy(self, signal, band_type):
        """Extrae y calcula la energía de una banda específica"""
        if band_type == 'alpha':
            filtered = apply_bandpass_filter(signal, *self.alpha_range, self.fs)
        elif band_type == 'beta':
            filtered = apply_bandpass_filter(signal, *self.beta_range, self.fs)
        else:
            raise ValueError("Band type must be 'alpha' or 'beta'")
        
        energy = np.mean(filtered ** 2)
        return energy, filtered
    
    def classify_mental_state(self, alpha_energy, beta_energy):
        """Clasifica el estado mental basado en las energías de las bandas"""
        ratio = alpha_energy / (beta_energy + 1e-6)
        
        if ratio > 1.3:
            return "Relajado (Alpha)", ALPHA_COLOR, 140
        elif ratio < 0.7:
            return "Activo (Beta)", BETA_COLOR, 70
        else:
            return "Equilibrado", BALANCED_COLOR, 105

# ==================== VISUALIZACIÓN ====================
class Visualizer:
    def __init__(self):
        # Configurar matplotlib
        plt.switch_backend('Agg')
        self.fig, self.ax = plt.subplots(figsize=(5, 3.5))
        self.fig.patch.set_facecolor('#0f0f19')
        self.ax.set_facecolor('#1a1a2e')
        
        # Historial de datos
        self.alpha_history = []
        self.beta_history = []
        self.time_history = []
        self.max_points = 150
    
    def update_history(self, alpha, beta, current_time):
        """Actualiza el historial de datos"""
        self.alpha_history.append(alpha)
        self.beta_history.append(beta)
        self.time_history.append(current_time)
        
        if len(self.time_history) > self.max_points:
            self.alpha_history.pop(0)
            self.beta_history.pop(0)
            self.time_history.pop(0)
    
    def create_plot_surface(self):
        """Crea superficie de pygame con el gráfico de matplotlib"""
        self.ax.clear()
        
        if len(self.time_history) > 1:
            self.ax.plot(self.time_history, self.alpha_history, 
                        label="Alpha (8-12 Hz)", color="#0096ff", linewidth=2)
            self.ax.plot(self.time_history, self.beta_history, 
                        label="Beta (13-30 Hz)", color="#ff3c3c", linewidth=2)
        
        self.ax.legend(loc='upper left', facecolor='#1a1a2e', 
                      edgecolor='white', fontsize=9)
        self.ax.set_ylim(0, 1)
        
        if len(self.time_history) > 0:
            self.ax.set_xlim(max(0, self.time_history[-1] - 30), 
                           self.time_history[-1] + 1)
        
        self.ax.set_xlabel("Tiempo (s)", color='white', fontsize=10)
        self.ax.set_ylabel("Energía Normalizada", color='white', fontsize=10)
        self.ax.tick_params(colors='white', labelsize=8)
        self.ax.grid(True, alpha=0.2, color='white')
        
        # Convertir a superficie de pygame
        self.fig.canvas.draw()
        plot_data = np.array(self.fig.canvas.buffer_rgba())
        plot_data = np.flipud(np.rot90(plot_data[:, :, :3]))
        return pygame.surfarray.make_surface(plot_data)

def draw_info_panel(screen, eeg_gen, alpha_energy, beta_energy):
    """Dibuja panel de información"""
    info_x = 50
    info_y = HEIGHT - 180
    
    # Fondo del panel
    panel_rect = pygame.Rect(info_x - 20, info_y - 20, 400, 160)
    pygame.draw.rect(screen, (30, 30, 50), panel_rect, border_radius=10)
    pygame.draw.rect(screen, (80, 80, 100), panel_rect, 2, border_radius=10)
    
    # Información
    info_texts = [
        f"Amplitud Alpha: {eeg_gen.alpha_amp:.2f}",
        f"Amplitud Beta: {eeg_gen.beta_amp:.2f}",
        f"Energía Alpha: {alpha_energy:.3f}",
        f"Energía Beta: {beta_energy:.3f}",
        f"Ratio A/B: {alpha_energy/(beta_energy+1e-6):.2f}"
    ]
    
    for i, text in enumerate(info_texts):
        surface = font_info.render(text, True, TEXT_COLOR)
        screen.blit(surface, (info_x, info_y + i * 30))

def draw_controls(screen):
    """Dibuja los controles en pantalla"""
    controls_x = WIDTH - 450
    controls_y = HEIGHT - 180
    
    panel_rect = pygame.Rect(controls_x - 20, controls_y - 20, 420, 160)
    pygame.draw.rect(screen, (30, 30, 50), panel_rect, border_radius=10)
    pygame.draw.rect(screen, (80, 80, 100), panel_rect, 2, border_radius=10)
    
    title = font_info.render("Controles:", True, (255, 255, 100))
    screen.blit(title, (controls_x, controls_y))
    
    controls = [
        "R - Simular estado relajado",
        "A - Simular estado activo",
        "ESPACIO - Estado normal",
        "ESC - Salir"
    ]
    
    for i, control in enumerate(controls):
        surface = font_small.render(control, True, TEXT_COLOR)
        screen.blit(surface, (controls_x, controls_y + 30 + i * 25))

# ==================== MAIN ====================
def main():
    # Inicialización
    eeg_gen = EEGGenerator()
    processor = SignalProcessor(SAMPLING_FREQ)
    visualizer = Visualizer()
    
    # Variables de estado
    running = True
    start_time = time.time()
    last_update = time.time()
    simulation_mode = 'normal'
    
    mental_state = "Equilibrado"
    circle_color = BALANCED_COLOR
    circle_radius = 105
    
    alpha_energy_norm = 0.5
    beta_energy_norm = 0.5
    
    while running:
        current_time = time.time() - start_time
        
        # Eventos
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False
                elif event.key == pygame.K_r:
                    simulation_mode = 'relaxed'
                elif event.key == pygame.K_a:
                    simulation_mode = 'active'
                elif event.key == pygame.K_SPACE:
                    simulation_mode = 'normal'
        
        # Actualizar amplitudes
        eeg_gen.update_amplitudes(simulation_mode)
        
        # Generar señal EEG
        eeg_signal = eeg_gen.generate_signal(time_window)
        
        # Procesar bandas
        alpha_energy, _ = processor.extract_band_energy(eeg_signal, 'alpha')
        beta_energy, _ = processor.extract_band_energy(eeg_signal, 'beta')
        
        # Normalizar energías
        total_energy = alpha_energy + beta_energy
        if total_energy > 0:
            alpha_energy_norm = alpha_energy / total_energy
            beta_energy_norm = beta_energy / total_energy
        
        # Clasificar estado mental cada 1.5 segundos
        if time.time() - last_update > 1.5:
            mental_state, circle_color, circle_radius = processor.classify_mental_state(
                alpha_energy_norm, beta_energy_norm
            )
            last_update = time.time()
        
        # Actualizar historial
        visualizer.update_history(alpha_energy_norm, beta_energy_norm, current_time)
        
        # ==================== RENDERIZADO ====================
        screen.fill(BG_COLOR)
        
        # Título
        title_text = font_title.render("Simulación BCI - Interfaz Cerebro-Computadora", 
                                       True, TEXT_COLOR)
        screen.blit(title_text, (WIDTH // 2 - title_text.get_width() // 2, 20))
        
        # Círculo principal (estado mental)
        circle_pos = (300, HEIGHT // 2 - 50)
        pygame.draw.circle(screen, circle_color, circle_pos, circle_radius)
        pygame.draw.circle(screen, TEXT_COLOR, circle_pos, circle_radius, 3)
        
        state_text = font_state.render(mental_state, True, TEXT_COLOR)
        state_rect = state_text.get_rect(center=circle_pos)
        screen.blit(state_text, state_rect)
        
        # Indicador de modo actual
        mode_text = font_info.render(f"Modo: {simulation_mode.upper()}", True, (255, 255, 100))
        screen.blit(mode_text, (circle_pos[0] - mode_text.get_width() // 2, 
                                circle_pos[1] + circle_radius + 20))
        
        # Gráfico
        plot_surface = visualizer.create_plot_surface()
        screen.blit(plot_surface, (WIDTH - plot_surface.get_width() - 30, 80))
        
        # Paneles de información
        draw_info_panel(screen, eeg_gen, alpha_energy_norm, beta_energy_norm)
        draw_controls(screen)
        
        pygame.display.flip()
        clock.tick(30)
    
    pygame.quit()
    plt.close('all')

if __name__ == "__main__":
    main()


