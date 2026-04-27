// ==================== CÂN BẰNG STATS & ARCS ====================
        const ARCS_CONFIG = {
            "arc1": { id: "arc1", name: "🌑 Arc 1: Bóng Đêm", levelRequired: 1, location: "city1",
                creeps: [{ name: "Hồn Ma", hp: 60, atk: 15, def: 5, exp: 50, gold: 30 }, { name: "Quỷ Nhỏ", hp: 120, atk: 25, def: 10, exp: 80, gold: 50 }],
                boss: { name: "Chúa Tể Bóng Đêm", hp: 300, atk: 45, def: 20, exp: 500, gold: 300, drops: ["Huy Hiệu Arc 1"] },
                rewards: { exp: 800, gold: 500, item: "Kiếm Tập Sự" }
            },
            "arc2": { id: "arc2", name: "🔥 Arc 2: Lửa Khởi Nguyên", levelRequired: 5, location: "city2",
                creeps: [{ name: "Quái Lửa", hp: 150, atk: 35, def: 15, exp: 120, gold: 80 }, { name: "Chó Săn Địa Ngục", hp: 280, atk: 50, def: 25, exp: 200, gold: 120 }],
                boss: { name: "Tướng Cướp Hỏa Ngục", hp: 700, atk: 80, def: 35, exp: 1200, gold: 600, drops: ["Huy Hiệu Arc 2"] },
                rewards: { exp: 1500, gold: 1000, item: "Giáp Lửa" }
            },
            "arc3": { id: "arc3", name: "❄️ Arc 3: Băng Giá", levelRequired: 9, location: "city2",
                creeps: [{ name: "Hồn Băng", hp: 280, atk: 60, def: 30, exp: 250, gold: 150 }, { name: "Người Tuyết", hp: 500, atk: 85, def: 40, exp: 400, gold: 200 }],
                boss: { name: "Nữ Hoàng Băng Giá", hp: 1200, atk: 120, def: 55, exp: 2000, gold: 1200, drops: ["Huy Hiệu Arc 3"] },
                rewards: { exp: 3000, gold: 1800, item: "Khiên Băng" }
            },
            "arc4": { id: "arc4", name: "⚡ Arc 4: Sấm Sét", levelRequired: 14, location: "city3",
                creeps: [{ name: "Tinh Linh Sấm", hp: 500, atk: 100, def: 45, exp: 450, gold: 250 }, { name: "Rồng Sấm Nhỏ", hp: 850, atk: 140, def: 60, exp: 650, gold: 350 }],
                boss: { name: "Thần Sấm", hp: 2000, atk: 180, def: 75, exp: 3500, gold: 2000, drops: ["Huy Hiệu Arc 4"] },
                rewards: { exp: 5000, gold: 3000, item: "Búa Sấm" }
            },
            "arc5": { id: "arc5", name: "🌪️ Arc 5: Lốc Xoáy", levelRequired: 19, location: "city3",
                creeps: [{ name: "Phantom Gió", hp: 850, atk: 150, def: 65, exp: 700, gold: 350 }, { name: "Thần Ưng", hp: 1400, atk: 190, def: 80, exp: 1000, gold: 500 }],
                boss: { name: "Phong Thần", hp: 3200, atk: 250, def: 95, exp: 5500, gold: 3000, drops: ["Huy Hiệu Arc 5"] },
                rewards: { exp: 8000, gold: 4500, item: "Cung Gió" }
            },
            "arc6": { id: "arc6", name: "🌍 Arc 6: Đất Mẹ", levelRequired: 24, location: "city4",
                creeps: [{ name: "Golem Đá", hp: 1500, atk: 210, def: 110, exp: 1200, gold: 600 }, { name: "Rồng Đất", hp: 2200, atk: 260, def: 130, exp: 1800, gold: 800 }],
                boss: { name: "Titan Đất", hp: 4800, atk: 320, def: 140, exp: 8500, gold: 4500, drops: ["Huy Hiệu Arc 6"] },
                rewards: { exp: 12000, gold: 6000, item: "Khiên Titan" }
            },
            "arc7": { id: "arc7", name: "👑 Arc 7: Quỷ Vương", levelRequired: 30, location: "city4",
                creeps: [{ name: "Cận Vệ", hp: 2200, atk: 300, def: 140, exp: 2000, gold: 1000 }, { name: "Rồng Bóng Tối", hp: 3800, atk: 380, def: 160, exp: 3000, gold: 1500 }],
                boss: { name: "QUỶ VƯƠNG", hp: 7500, atk: 450, def: 180, exp: 15000, gold: 8000, drops: ["Huy Hiệu Arc 7"] },
                rewards: { exp: 25000, gold: 15000, item: "Kiếm Hủy Diệt" }
            }
        };

        // ==================== HỆ THỐNG CÀY QUÁI ====================
        const FARMING_ZONES = [
            { id: "f1", name: "🌲 Rừng Goblin", reqLevel: 1, hpRange: [30, 60], atkRange: [10, 20], expRange: [20, 40], goldRange: [10, 30], apDrop: [1, 3], 
              skillDrops: [{ id: "s1", rate: 0.1 }, { id: "s2", rate: 0.1 }], emoji: "👹" },
            { id: "f2", name: "💀 Hang Xương", reqLevel: 5, hpRange: [80, 150], atkRange: [30, 50], expRange: [60, 100], goldRange: [40, 80], apDrop: [2, 5], 
              skillDrops: [{ id: "s3", rate: 0.08 }, { id: "s4", rate: 0.08 }], emoji: "💀" },
            { id: "f3", name: "🌑 Rừng Ma", reqLevel: 10, hpRange: [150, 300], atkRange: [60, 100], expRange: [150, 250], goldRange: [80, 150], apDrop: [3, 8], 
              skillDrops: [{ id: "s5", rate: 0.05 }, { id: "s6", rate: 0.05 }, { id: "s7", rate: 0.05 }], emoji: "👻" },
            { id: "f4", name: "🔥 Đầm Quỷ", reqLevel: 18, hpRange: [300, 550], atkRange: [120, 180], expRange: [300, 500], goldRange: [150, 300], apDrop: [5, 12], 
              skillDrops: [{ id: "s8", rate: 0.03 }, { id: "s9", rate: 0.03 }, { id: "s10", rate: 0.02 }, { id: "s11", rate: 0.05 }, { id: "s12", rate: 0.01 }], emoji: "👿" }
        ];

        // ==================== KỸ NĂNG ANIME ====================
        const ANIME_SKILLS = {
            "s1": { name: "Water Breathing 10th Form", origin: "Tanjiro (Kimetsu)", desc: "Gây sát thương bằng 3.5x ATK", mpCost: 15, emoji: "🌊", effect: (p, e) => { return p.stats.atk * 3.5; }, fx: "🌊" },
            "s2": { name: "Normal Punch", origin: "Saitama (OPM)", desc: "Cú đấm thường: 2.5x ATK, 0 MP", mpCost: 0, emoji: "👊", effect: (p, e) => { return p.stats.atk * 2.5; }, fx: "💥" },
            "s3": { name: "Rasengan", origin: "Naruto", desc: "Sát thương: 4x ATK + 3x STR", mpCost: 25, emoji: "🌀", effect: (p, e) => { return (p.stats.atk * 4) + (p.stats.str * 3); }, fx: "🌀" },
            "s4": { name: "Shadow Step", origin: "Sung Jin-Woo (Solo)", desc: "Né đòn và phản công 3x ATK", mpCost: 20, emoji: "👤", effect: (p, e) => { p.buffs.dodgeNext = true; return p.stats.atk * 3; }, fx: "🌑" },
            "s5": { name: "Kamehameha", origin: "Son Goku (DB)", desc: "Sát thương chưởng: 5x INT + 2x ATK", mpCost: 40, emoji: "☄️", effect: (p, e) => { return (p.stats.int * 5) + (p.stats.atk * 2); }, fx: "🔵" },
            "s6": { name: "Gear Second", origin: "Luffy (One Piece)", desc: "Tăng mạnh tốc độ, x3 ATK trong 3 lượt", mpCost: 35, emoji: "💨", effect: (p, e) => { p.buffs.gear2 = 3; return 0; }, fx: "♨️" },
            "s7": { name: "Getsuga Tensho", origin: "Ichigo (Bleach)", desc: "Chém sóng năng lượng: 5x ATK", mpCost: 30, emoji: "🗡️", effect: (p, e) => { return p.stats.atk * 5; }, fx: "🌙" },
            "s8": { name: "Predator", origin: "Rimuru (Slime)", desc: "Hút 30% máu tối đa + 2x INT", mpCost: 50, emoji: "💧", effect: (p, e) => { let dmg = (e.maxHp * 0.3) + (p.stats.int * 2); p.currentHp = Math.min(p.stats.hp, p.currentHp + dmg); return dmg; }, fx: "🦠" },
            "s9": { name: "Infinity", origin: "Gojo (JJK)", desc: "Vô hạn: Miễn nhiễm mọi sát thương lượt tới", mpCost: 60, emoji: "🤞", effect: (p, e) => { p.buffs.infinity = 1; return 0; }, fx: "🌌" },
            "s10": { name: "Grasp Heart", origin: "Ainz (Overlord)", desc: "Tỉ lệ 30% kết liễu ngay lập tức (Nếu xịt: 5x INT)", mpCost: 80, emoji: "🖤", effect: (p, e) => { if(!e.isBoss && Math.random() < 0.3) return e.hp; return p.stats.int * 5; }, fx: "💀" },
            "s11": { name: "Thunderclap Flash", origin: "Zenitsu (Kimetsu)", desc: "Chớp nhoáng: 4.5x ATK", mpCost: 30, emoji: "⚡", effect: (p, e) => { return p.stats.atk * 4.5; }, fx: "⚡" },
            "s12": { name: "Serious Punch", origin: "Saitama (OPM)", desc: "Đấm nghiêm túc: 15x ATK. Cực hiếm!", mpCost: 100, emoji: "☄️👊", effect: (p, e) => { return p.stats.atk * 15; }, fx: "💥💥" }
        };

        const statKeys = ['str', 'dex', 'int', 'hp', 'mp', 'sp', 'atk', 'def', 'speed', 'critR', 'critD', 'wis'];
        
        function getInitialGameState() {
            return {
                player: {
                    name: "", avatar: "", level: 1, exp: 0, expToLevel: 100, ap: 0,
                    stats: {str:10, dex:10, int:10, hp:50, mp:20, sp:20, atk:10, def:5, speed:10, critR:5, critD:50, wis:5},
                    currentHp: 0, currentMp: 0, currentSp: 0, gold: 500, inventory: [],
                    equipment: { weapon: null, armor: null, accessory: null },
                    learnedSkills: [], buffs: {},
                    completedArcs: [], currentArc: null, arcProgress: { currentWave: 0, totalWaves: 10, bossDefeated: false }
                },
                inCombat: false, currentEnemy: null, selectedArc: null, actionLocked: false
            };
        }
        
        let gameState = getInitialGameState();
        
        let creationStats = {};
        let creationPoints = 70;
        const SHOP_ITEMS = [
            { id: "hp_small", name: "Bình HP Nhỏ", type: "hp", val: 50, price: 50, emoji: "🧪" },
            { id: "hp_large", name: "Bình HP Lớn", type: "hp", val: 200, price: 150, emoji: "🏺" },
            { id: "mp_small", name: "Bình MP Nhỏ", type: "mp", val: 40, price: 80, emoji: "💧" },
            { id: "mp_large", name: "Bình MP Lớn", type: "mp", val: 150, price: 200, emoji: "🌊" }
        ];

        const EQUIPMENT_DB = {
            "Kiếm Tập Sự": { type: "weapon", name: "Kiếm Tập Sự", stats: { atk: 15, str: 5 }, emoji: "🗡️", desc: "Tăng 15 ATK, 5 STR", price: 300, reqArc: 0 },
            "Giáp Lửa": { type: "armor", name: "Giáp Lửa", stats: { def: 20, hp: 100 }, emoji: "🔥", desc: "Tăng 20 DEF, 100 HP", price: 800, reqArc: 1 },
            "Khiên Băng": { type: "armor", name: "Khiên Băng", stats: { def: 40, hp: 200 }, emoji: "❄️", desc: "Tăng 40 DEF, 200 HP", price: 1500, reqArc: 2 },
            "Búa Sấm": { type: "weapon", name: "Búa Sấm", stats: { atk: 60, critD: 20 }, emoji: "⚡", desc: "Tăng 60 ATK, 20% Sát thương CM", price: 2500, reqArc: 3 },
            "Cung Gió": { type: "weapon", name: "Cung Gió", stats: { atk: 80, speed: 30, dex: 20 }, emoji: "🌪️", desc: "Tăng 80 ATK, 30 Tốc độ, 20 DEX", price: 4000, reqArc: 4 },
            "Khiên Titan": { type: "armor", name: "Khiên Titan", stats: { def: 100, hp: 800 }, emoji: "🛡️", desc: "Tăng 100 DEF, 800 HP", price: 6000, reqArc: 5 },
            "Kiếm Hủy Diệt": { type: "weapon", name: "Kiếm Hủy Diệt", stats: { atk: 250, str: 100, critR: 15 }, emoji: "⚔️", desc: "Tăng 250 ATK, 100 STR, 15% Tỉ lệ CM", price: 10000, reqArc: 6 }
        };

